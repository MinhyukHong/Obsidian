---
Date: 2026-09-03
topic:
in progress: true
done:
summary:
---
## Milestones

### 알고리즘

- 최종 output 수정
1. unsanitized_input_reachable
2. sanitized_input
3. unreachable

- JS input sanitization 로직 추가
	- JS에서 검사한 값 = native에 전달된 값
	- JS 검사가 해당 입력값에 대해서 연결된 native 위험을 충분히 막는가
---

### 비교 도구

- LLMs
- CHARON:
	- repo/`npm_ne.csv` - 9082 packages
	- 2024-09-19 버전으로 수집
	- ok: 8879 packages (==결과가 0이 아닌 100(~200)만 뽑아서==)
	- failed: 203 packages (과거 버전이 npm registry에서 unpublish된 실패 목록)
	- sample test -> 전체 실행
- Bilingual Problems: 교신저자 메일
	- path-insensitive (sanitizer로 가는 흐름이 있다면 sink 흐름 전체를 safe로 판단)
	- 경계에서 딱 한 번 연결
	- 함수 등록&도달 가능하면 모든 인자를 tainted로 봄 -> ==Ablation?==(인자단위 정밀매칭 off)
	- **정확도 측정: 실험 전에 flowjs를 정의(xbind-인자단위-경로전체) >> discussion에서 변명**
	- **MOVERY 구현 참고 (MVP)**
---

### CWE mapping

- CWE category별 patch 사례 수집
	- 각 category에서 수정 전후 코드 비교 -> sanitizer 후보
- 수정 코드에서 개발자가 추가한 검증 코드(e.g., length check, null check, divided by zero)
- 자주 반복해서 등장한 패턴만 채택(*최소 10개*) >> ==10이라는 숫자의 정당성을 설득. 서로 다른 repo 3개 이상, 전체 집합 10개 이상 -> common하게 등장한 애들 -> reference를 1~2보여주면 좋음==
- 취약점 종류마다 검증 코드가 다르도록:
	- buffer 관련 -> 길이/크기/최대값 check
	- array 관련 -> 음수 index, 배열 범위 넘는지
	- 정수 overflow -> 값 크기 확인/ overflow safe 연산
	- null dereference -> 포인터가 null인지
	- ...
- 함수 안에 검증 코드가 있어도 위험 연산/sink 전에 실행되는 코드만 sanitizer로 취급(무관한 검사도 안전하다고 판단하지 않기 위해)
- 10개로 채택은 했지만 여러 프로젝트에서 반복되는지 여부와 검증 데이터셋에서 정확도 확인 후 수정 예정
---

### Research Questions

- RQ1: Dataset 통계(==RQ 이전 등장해야 할 항목==)
- RQ2: Detection Accuracy -> microbenchmark X
	- C/C++ sink 흐름, 내부 sanitizer check과 같은 native side flow detection 성능
	- 불가능: JS->native 연결, JS 측 sanitizer check, JS-C/C++ end-to-end 취약 흐름 탐지
- RQ3: Effectiveness (argument-level 매칭, 비동기 처리, ) -> old data
- RQ4: Real-World Application (new data -> triggerable)
- RQ5: Comparison with prior work (XBind, LLMs, CHARON, Bilingual)
+RQ6: Performance and scalability
---


## Comments

- CHARON - (결과가 0이 아닌 100(~200)만 뽑아서)
- 교신저자 메일 보내기
- Bilingual Problems 관련:
	- 정확도 측정: 실험 전에 flowjs를 정의(xbind-인자단위-경로전체) >> discussion에서 변명
	- **MOVERY 구현 참고 (MVP)**
- CWE mapping에서: 10이라는 숫자의 정당성을 설득해야 함. (e.g., 서로 다른 repo 3개 이상, 전체 집합 10개 이상 -> common하게 등장한 애들. 이 숫자에 대한 정당성을 부여해주는 reference를 1~2보여주면 좋음)
- Research Questions
	- RQ1: 최신 버전 툴 적용(JS, native 모든 결과 1장~) + case(appendix로 빼도)
	- RQ2: 기존 기술 비교 (4개끼리 비교) - 패키지 100개 or flow 단위(수동검증 가능한 만큼)
		- LLMs 비교할 때: C sink 함수 (file, line) 제공
	- RQ3: Ablation
	- RQ4: performance
---