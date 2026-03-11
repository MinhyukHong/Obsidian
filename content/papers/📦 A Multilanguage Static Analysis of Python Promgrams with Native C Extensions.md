---
review date: 2026-03-11
conference: SAS 2021
reading: true
done: true
summary: Python + C 혼합 프로그램을 Stub 없이 두 언어 동시에 정적 분석하는 Abstrat interpretation based analyzer Mopsa를 제안한다.
---
## Abstract

- GitHub에서 가장 많이 다운로드되는 Python 라이브러리 200개를 대상으로, 5개 중 1개에는 C코드가 포함되어 있다.
- 정적 분석기는 단일 언어에 초점을 맞추는 경향이 있고 Stub을 사용하여 외부 함수 동작을 모델링할 수 있다.
	- 그러나 이는 구현하는 데 비용이 많이 들고 분석기의 soundness를 약화시킨다.
- 본 연구에서는 C 확장을 호출하는 Python 프로그램을 처리할 수 있는 abstract interpretation을 통해 정적 분석기를 설계한다.
- 정적 분석기는 Python, C 및 인터페이스에서 발생할 수 있는 런타임 오류를 보고한다.
---


## 1. Introduction

- host language는 인터페이스를 통해 guest language를 호출한다. (==interface = boundary==)
- guest language: C, 네이티브 코드, 네이티브 C
- host language: Python
- 파이썬에서는 기본 C 모듈을 사용하며 효율적인 C 코드를 호출하는 high-level 파이썬 코드를 작성한다.
- 이는 효율적이지만 여러 버그를 발생시키는데, ==개발자는 다양한 안전 메커니즘과 메모리 표현식을 고려해야 한다==.
- Python 🆚 C
	- 파이썬은 실행 중 에러가 발생하면 Exception 형태로 캡슐화되어 보고되지만, C 코드 영역에서 런타임 에러가 발생하면 파이썬의 예외 처리 시스템이 이를 감지하기도 전에 운영체제가 프로세스를 강제로 종료(Hard crash)시켜 버릴 수 있다.
	- Representation: 파이썬 정수 객체는 최소 24바이트의 메모리를 사용하고 unlimited precision, C 정수는 고정된 길이(일반적으로 8~64비트 범위)를 가지며 오버플로우가 발생할 수 있다.
- 정적분석기는 Stub을 사용하여 다른 언어에 대한 호출 동작을 모델링할 수 있지만, 구현하는 데에 시간 소요가 많이 되고 실제 코드를 분석하는 것이 아니기 때문에 건전성과 정확성 측면을 훼손할 수 있다.
- Mopsa를 기반으로 구현: 네이티브 C 코드와 파이썬 코드를 모두 분석하는 것을 목표로 한다. (네이티브 단에서 파이썬 코드에 대한 callback 포함)
- Abstract interpretation: precise, flow, and context-sensitive value analysis
- Mopsa + Multilanguage C/Python 프로그램에 대한 지원 추가 (boundary를 모델링하는 도메인을 추가)
---

### Limitations

- garbage collection 미지원: reference counting을 기반으로 한 garbage collection은 본 연구의 semantic으로 지원되지 않는다. 따라서 deallocation을 감지하지 못한다. → 참조 카운팅 오류(조기/지연 해제) 탐지 불가
- Lack of formal soundness proof: 분석 도구가 설계한 논리 모델이 실제 파이썬 인터프리터(CPython)의 동작과 100% 일치한다는 것을 증명하지 못했기 때문에 미탐(FN)의 가능성이 있다.
- Builtins API 사각지대: 분석의 효율성을 위해 일부 복잡한 API 기능을 내부적으로 미리 정의된 함수처럼 간주하여 처리 👉🏻 API 자체 구현부에 런타임 에러가 숨어 있다면 분석 도구는 이를 검증하지 못한다.
- 일부 Python 표준 라이브러리(`pickle`, `sys.getsizeof` 등) 미지원
- 복잡한 동적 배열·포인터 구조에서 C 분석 정밀도 저하
---


## 3. Methodology

### 3.1. Idea

- Python C API를 공식 경계로 삼아, 각 언어의 의미론을 블랙박스로 유지하면서 ==경계 연산만 별도로 정의==한다.
- 핵심 가정: C 코드는 Python 내장 객체에 API를 통해서만 접근한다. API 호출은 Python 의미론으로 위임 가능
---

### 3.2. Concrete Semantics

#### 결합 상태 (Combined State)

| 상태           | 구성 요소                                            |
| ------------ | ------------------------------------------------ |
| Python 상태 Σp | 환경 Ep (변수→주소) + 힙 Hp (주소→객체) + 흐름 토큰 (cur / exn) |
| C 상태 Σc      | 메모리 셀 Ec + 힙 Hc (주소→자원 타입·크기)                    |
| **결합 상태 Σ**  | **Σp × Σc** (주소 공간 Addr 공유)                      |

- C에서 PyType_GenericNew로 할당된 객체 → Python 변수 `c`가 해당 주소를 직접 참조 (복사 없음)
- `PyAlloc` 자원 타입으로 Python 객체 구분 → C가 직접 접근 시 탐지 가능

#### 경계 함수 (Boundary Functions)

두 방향 모두 **lazy & shallow** 방식으로 동작한다.
- **lazy**: 실제로 언어를 넘나드는 객체만 변환
- **shallow**: 이미 상대 힙에 등록된 주소는 재변환하지 않음

|방향|함수|주요 동작|
|---|---|---|
|Python → C|`p ↪ c`|ob_type 초기화, PyAlloc으로 C 힙에 등록, 클래스면 PyType_Ready 호출|
|C → Python|`c ↪ p`|PyAlloc 여부 검사, ob_type을 재귀적으로 Python 힙에 등록|

#### 언어 전환 연산 3종

**① C call from Python** (Python이 C 함수 호출)

```
in_check  →  p↪c(self, args)  →  C 함수 실행  →  out_check  →  c↪p(반환값)
```

- `in_check`: 인스턴스 타입 검사, 실패 시 TypeError
- `out_check`: NULL 반환 ↔ 예외 설정 일관성 검사, 불일치 시 **SystemError**

**② Python call from C** (C에서 Python 콜백 `PyObject_CallObject`)

```
c↪p(f, args)  →  Python 의미론으로 실행  →  정상이면 p↪c(결과)
                                            →  예외 발생이면 NULL + PyErr_SetNone
```

**③ 정수 변환** (`PyLong_AsLong` / `PyLong_FromLong`)

- Python 정수(무한 정밀도) ↔ C long(64비트) 범위 검사
- 범위 초과 → **OverflowError**, 타입 불일치 → **TypeError**
- `PyArg_ParseTuple`의 `|i` 포맷은 이 변환을 내부적으로 사용하며 C 코드 그대로 분석
---

### 3.3. Abstract Semantics

#### 공유 추상 도메인

```
결합 추상 상태: Σ]p×c = Σ̃]p × Σ̃]c × Σ]u
                              ↑ 공유
                   주소 할당 추상 + 수치 추상 (Interval, Octagon 등)
```

- Python과 C가 **같은 수치 도메인**을 공유 → 언어 간 관계형 불변식 표현 가능
- 추상 경계 함수는 구체 경계 함수와 **1:1 대응** → 건전성 증명이 단순해짐

#### 관계형 분석의 이점

비관계형(Interval)만으로는 Python 변수 `i`와 C 구조체 필드 `count`의 관계를 표현할 수 없다.

```python
# rel_count.py
for i in range(randint(1, 100)):
    c.incr()
r = c.counter
assert(r == i + 1)  # 비관계형으로는 증명 불가
```

→ Octagon 도메인으로 `num(@int) + 1 = num([Counter, offset16, s32])` 관계를 표현하면 어서션 증명 가능

---

### 3.4. Mopsa Architecture

```
┌─────────────────────────────────────┐
│        CPython 다중언어 도메인       │  ← 경계 연산 담당 (신규 ~2,500줄)
├──────────────┬──────────────────────┤
│  Python 분석 │      C 분석          │  ← 기존 분석기 재사용 (카테시안 곱)
│  ~12,600줄   │    ~11,700줄         │
├──────────────┴──────────────────────┤
│         Universal 도메인            │  ← 절차간 분석, 루프, 주소 할당, 수치 추상
│              ~5,600줄               │
└─────────────────────────────────────┘
         공통 프레임워크 ~13,200줄
```

- **설정 파일(DAG)** 로 도메인 조합 → 다중언어 도메인만 추가하면 기존 분석 재사용 가능
- 수치 추상: 기본값 Interval, 선택적으로 Octagon 등 관계형 도메인으로 교체 가능
- CPython C 함수 60개(~650줄) 원본 코드 그대로 재사용
---


## 4. Detectable Runtime Error

|영역|오류 유형|
|---|---|
|C 코드|정수 오버플로, 제로 나눗셈, 잘못된 포인터/메모리 접근|
|Python 코드|AttributeError, TypeError, ValueError|
|경계 (API)|NULL ↔ 예외 불일치(SystemError), 정수 변환 오버플로(OverflowError)|

---

## 5. Results

|라이브러리|C줄|Py줄|분석 시간|C 선택성|Py 선택성|
|---|---|---|---|---|---|
|noise|722|675|19s|99.6%|100.0%|
|ahocorasick|3,541|1,336|59s|93.1%|98.0%|
|levenshtein|5,441|357|1.6m|79.9%|93.2%|
|cdistance|1,433|912|1.9m|95.3%|98.3%|
|llist|2,829|1,686|4.3m|99.0%|98.8%|
|bitarray|3,244|2,597|4.6m|96.3%|94.6%|

> **선택성(Selectivity)** = 안전 판정 연산 수 / 전체 검사 수. 높을수록 허위 경보(false alarm)가 적음.
---
