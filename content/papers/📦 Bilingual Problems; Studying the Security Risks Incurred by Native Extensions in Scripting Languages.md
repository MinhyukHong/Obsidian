---
review date: 2026-01-26
conference: Usenix Security 2023
reading: true
done:
summary:
---
## Abstract

- 스크립트 언어는 손쉬운 사용과 활발한 소프트웨어 생태계 덕분에 높은 인기를 얻는다.
	- 디자인적으로 crash와 메모리 안전성을 지닌다.
	- 따라서 C 코드의 만연한 것과 같은 low-level 보안 문제들을 신경쓸 필요가 없다.
- 하지만 스크립트 언어는 네이티브 확장을 허용하는데, 이를 통해 사용자 정의 C/C++ 코드를 high-level 언어에서 직접 호출할 수 있다.
	- 프로그램의 퍼포먼스를 높이고 legacy code의 재사용성이라는 장점이 있지만 cash safety와 같은 문제를 보장해주진 못한다.
- ==본 연구에서는 세 가지 인기 스크립트 언어에 대한 네이티브 확장 API 오용(misuse)에 대한 비교분석을 제공한다.== 추가적으로, 네이티브 확장 API 오용을 연구하기 위한 새로운 방법론에 대해 논의한다.
---


## 1. Introduction

- 현대의 스크립트 언어(Python, Ruby, JavaScript)의 주 사용 목적은 웹 애플리케이션 개발이다.
	- 최근에는 머신러닝을 위한 Python의 TensorFlow나 휴대용 데스크탑 애플리케이션을 위한 JavaScript의 Electron.js와 같이 강력하고 새로운 사례를 통해 엄청난 인기를 끄는 범용 프로그래밍 언어가 되었다.
- 이러한 발전은 npm, PyPI, RubyGems 와 같은 거대한 오픈소스 생태계 덕분이다.
- 이전 연구(소프트웨어 레포지토리, 현실 세계 웹사이트에 영향을 주는 보안 위협의 과잉 식별)는 스크립트 코드에 드러난 보안 위험성만을 고려했기 때문에, 현재 생태계의 cross-language 상호작용에 대한 중요성은 무시되었다.
- npm, pip, gem과 같은 패키지 매니저는 설치 시 확장의 바이너리를 컴파일하여 원활한 사용을 가능하게 한다.
- 바이너리는 스크립트 코드 프로세스에서 런타임 요청 시 로드되어 cross-language 협력이 가능해진다.
	- 개발자들은 원래 스크립트 언어의 범위를 벗어난 하드웨어 기능을 도출할 수 있다.
- 네이티브 확장은 low-level로 작성된 레거시 코드를 재사용할 수 있다.
	- 데이터베이스(SQLite), 암호화 라이브러리(OpenSSL)는 네이티브 확장을 사용하여 노출되는 경우가 많다.
	- 네이티브 확장은 low-level로 성능이 중요한 코드 개발을 지원한다.
		- e.g., TensorFlow의 중요한 부분은 C++로 작성되었고 바인딩을 통해 파이썬에 드러나게 된다.
- 신뢰할 수 있는 네이티브 확장을 작성하는 것은 어려운데, 이는 ==언어 간 경계에서 발생할 수 있는 문제들 때문이다. 주된 문제는 데이터를 나타내는 근본적인 차이에서부터 시작한다.== (e.g., weak dynamic typing vs. strong static typing)
- 네이티브 확장 내부에서의 실수는 종속된 라이브러리나 서비스 출시를 앞둔 애플리케이션을 손상시키며 생태계 전반에 영향을 미칠 수 있다.
![Figure 1](BilingualProblems_F1.png)
- Figure 1
	- **nativepad** 패키지는 네이티브 확장을 사용하여 리터럴 "pad"로 오른쪽에 주어진 문자열을 채운다.
	- (c)에 있는 네이티브 확장 은 확장 API에 4개의 호출을 사용한다:
		- line 5에서 인자를 검색
		- line 7에서 첫번째 인자의 길이를 가져옴
		- line 10에서 JS string을 C string으로 변환
		- line 12에서 C stringdmf JS string으로 back
		- 추가로, 확장은 padded string을 저장하기 위한 메모리를 할당하고 **strcat**을 이용하여 문자열을 연결한다.
	- (b)는 **natviepad** 패키지의 JavaScript 코드이다. 입력에 대한 간단한 null 검사를 수행하고 네이티브 확장의 **Pad** 기능을 호출하는 코드이다.
	- (a)는 클라이언트이고 다른 인수를 사용하여 내보낸 함수를 호출한다.
		- 클라이언트는 네이티브 확장의 사용에 대해 의식하지 못한다.
			- line 1의 **require** 구문은 "pure"한 JS 패키지를 로딩하는 것과 정확히 일치한다.
			- **nativepad**를 well-behaved 문자열로 호출할 경우, padding은 기대한대로 수행된다.
			- 하지만 null terminator(**\0**)가 문자열 안에 나타날 경우, 네이티브 확장은 초기화되지 않은 메모리를 노출한다. 이는 C에서 문자열 종료로 이어지지만 JavaScript 런타임은 이 문자를 다른 문자로 처리하여서 *문자열 길이에 포함되게 된다.*
			- 더욱 심각한 행위가 나타나기도 하는데, 예상치 못한 값(Booleans or 특정 객체 리터럴)이 제공될 경우 Node.js 프로세스에서의 hard crash가 발생하기도 한다. -> DoS
	- 제공된 예시는 네이티브 확장 API의 모범 사례(인수 타입이나 반환 값 확인)를 따르지 않는다. 오용을 방지하기 위해서는 런타임이 강력해야(robust) 한다.
- 네이티브 확장 API의 design space 탐색을 위해 세 가지 스크립트 언어를 연구하며 오용이 가능한지 확인한다. 하지만 언어마다 상당한 차이가 존재한다.
	- Node.js API는 가장 permissive하다. 이는 여러 유형의 오용을 허용한다: 네이티브 확장을 충분하지 않은 인수로 호출하거나 언어 경계를 넘어 교환되는 숫자 값에 대한 overflow를 허용
- ==네이티브 확장이 보안에 미치는 영향을 연구하기 위해 본 연구의 방법론은오픈소스 라이브러리의 오용을 먼저 식별한다.==
	- 이를 위해 ==intra-procedural 및 cross-language 정적 분석을 수행==한다.
	- 언어 경계의 가까운 두 가지 함수를 결합하는 cross-language 그래프 구성하는 간단하면서도 효과적인 방법을 제안한다.
	- 그리고 오픈 소스 웹 애플리케이션에 대한 ==수요 중심 데이터 흐름 분석(demand-driven data-flow analysis)==을 수행하며 애플리케이션 레벨에서의 라이브러리 레벨 문제의 영향을 연구한다.
- **Evaluation**
	- 네이티브 확장이 포함된 6,432개의 npm 패키지의 오용 확산에 대한 실증적 연구를 수행
	- 인기 있는 패키지조차도 오용되기 쉽고, 공격자가 API 오용으로 인해 발생하는 버그를 활용하여 웹 애플리케이션에 실질적은 피해를 입힐 수 있다는 증거를 제공한다.
		- 33 npm 패키지에 대한 PoC를 제공.
	- 원격으로 심각한 충돌(hard crash)이 발생할 수 있는 6개의 오픈소스 웹 애플리케이션을 식별한다.
	- 조사 결과에 대해 7개의 CVE를 할당 받았고, 대부분 심각도가 '높음'으로 분류되었다.
- **Novel contributions**:
	- 스크립트 언어의 네이티브 확장 보안 위험을 철저하게 분석. 몇몇 디자인은 취약점을 발생시키고 개발자가 안전하게 API를 사용하는 작업에 부담을 줌.
	- 새로운 방법론: 네이티브 확장 API의 오용으로 인해 발생하는 취약점을 연구할 수 있도록. 자동 취약점 탐지를 위해 cross-language 정적 분석을 사용.
	- 네이티브 확장으로 인해 발생하는 취약점들이 오픈소스 소프트웨어 패키지에 존재한다는 것과 네이티브 확장을 사용하는 웹 애플리케이션에도 영향을 미친다는 증거를 제공한다.
---


## 2. Threat Model

- 연구에서는 공격자가 네이티브 확장 코드에 대한 제어권이나 임의의 스크립트 언어 코드를 실행하는 권한이 없다고 가정한다.
- 확장 프로그램의 개발자는 악의적이지 않더라도 의도치 않게 코드에 취약점을 도입할 수 있다.
- 연구에서는 스크립트 언어의 보장을 깨뜨리는 방식으로 사용될 수 있는 경우 네이티브 확장이 취약하다고 간주한다.
	- e.g., 프로세스가 중단될 수 있는 경우, 의도하지 않은 위치에서의 read/write, 임의 코드 실행.
- 네이티브 확장이 공급망에 악성 페이로드를 숨기거나 프로테스트웨어 공격에 사용될 수도 있다.
- ==Goal: 네이티브 확장의 개발자가 악의가 없더라도 그 취약점의 위험성을 증명한다.== (따라서, 공급망 남용 공격을 탐지하는 것은 이 연구의 작업 범위를 벗어난다)
- 두 가지 공격자 모델
	1. **Strong attacker model**
		- 네이티브 확장이 포함된 패키지를 격리시켜 분석하기 위함
		- 공격자는 네이티브 확장을 사용하여 라이브러리에 전달된 모든 인수와 그 수를 제어할 수 있다.
		- 하지만, JSON으로 직렬화될 수 있는 객체만이 인수로 허용되고 내장 항목(builtins)의 수정은 허용되지 않는다.
			- 예를 들어, 본 연구의 세팅에서는 공격자가 정의한 함수를 사용하거나 **Object.prototype**을 변경할 수 없도록 한다.
	2. **Weak attacker model**
		- 네이티브 확장 취약점을 식별하기 위해 weak attacer model 하에서 원격으로 트리거 될 수 있다.
		- 이는 HTTP 인터페이스를 통해서만 웹 애플리케이션에 입력을 제공한다고 가정한다.
		- 입력은 네이티브 확장으로 전파되고 구현 상에서 취약점을 트리거한다.
---


## 3. Misuse in Different Languages

- 기존 네이티브 확장 API의 함정을 밝히기 위해 ==세 가지의 다른 스크립트 언어로 간단한 확장을 구축==한다. 이 확장들은 의도적으로 취약하며 API의 특이한 케이스를 강조하기 위함이다. (스크립트 언어에서 나오는 값에 대한 타입 검사 생략)
- 그 후 취약한 확장의 메소드에 값(well-crafted)을 제공함으로써 스크립트 언어의 안전성을 무너뜨린다. 👉🏻 Strong attacker model
	- API가 적극적으로 악용을 방지하려고 시도하는지, 만약 그렇다면 어떤 방식으로 시도하는지 관찰한다.
- [[📦 Finding and Preventing Bugs in JavaScript Bindings]] 연구 인용 + 네이티브 확장과 관련된 몇 가지 오용 사례도 추가(e.g., 지역 변수 read-write)
- Node.js 15.4.0, Python 3.8.5, Ruby 2.7.0p0
	- Node.js - Nan & N-API

- ![Table 1](BilingualProblems_T1.png)
	- 네이티브 확장의 no-crash philosophy 위반
		- producing low-level crashes($M_2$)
		- leaking low-level exceptions ($M_1$)
		- ➡️ **try-catch** block으로 핸들링 불가

- **Error containment**
	- Scripting Languages 👉🏻 no-crash philosophy
		- Ex. case of division by zero, Ruby and Python produce and exception (**try-catch**). JavaScript outputs the **Infinity** value.
		- Node.js 개발자들은 예상치 못한 예외로 애플리케이션이 중단되는 것을 방지하기 위해 프로세스 레벨 예외 처리기에 의존하는 경우가 많다.

- ![Algorithm 1](BilingualProblems_A1.png)
	- **int64** C 타입을 래핑하는 **int64-napi** npm 패키지 - **divide** method

- **Argument translation**
	- 언어 간 격차
		- 분석되는 스크립트 언어: weakly-, dynamically-typed
		- C/C++: strongly-, statically-typed
		- 따라서 네이티브 확장 API는 두 시스템 간을 변환하는 데 도움을 주어야 한다.
	- Ruby에서는 확장 선언 시점에 인수를 특정해야 한다.
	- Python에서 인수 검색을 위한 API는 인수의 개수($M_4$)와 타입($M_3$)을 사용자에게 지정하도록 한다.
		- 이러한 사항을 위반하면 메서드 호출이 중단된다.
	- Node.js API는 사용자가 인수 타입과 개수를 검사하고 실행될 시점을 결정한다.

- **Missing return**
	- Python, Ruby, N-API에서 반환 값을 읽을 때 missing return 구분($M_7$)은 심각한 충돌을 야기한다.
	- 분석의 타겟 언어에서 확장으로부터 null 값을 반환하는 것은 아무 문제도 일으키지 않았지만, **void**($M_8$)를 반환 값으로 선언할 경우 Python 메소드 호출 시 심각한 충돌이 발생한다.

- **Memory issues**
	- 네이티브 확장은 초기화되지 않은 메모리 영역을 스크립트 언어에 노출할 수 있다. ($M_9$)
		- 메모리 위치는 프로세스에서 사용할 수 있는 민감한 사용자 정보를 포함할 수 있다.
		- N-API와 Python에서 초기화되지 않은 문자열과 버퍼를 모두 노출할 수 있다.
		- 반면 Ruby와 Nan은 초기화되지 않은 메모리 영역을 null 바이트로 사전에 초기화한다.
		- 메모리 문제는 garbage collector가 언어 간 경계($M_{10}$)를 통해 교환된 인터페이스 객체에 대해 포인터를 해제하지 않음으로서 발생할 수 있다.

- **High-level issues**
	- 연구에서 고려되는 대부분의 API는 C/C++ 세계에 대한 불투명 포인터만 노출한다. 이는 네이티브 확장이 객체의 정확한 메모리 위치에 직접 액세스할 수 없다는 것과, API 도움 없이는 수정 또한 불가능하다는 것을 의미한다.
	- Ruby에서는 확장에 전달된 인수 뿐만 아니라 동일한 메모리 영역($M_{11}$)에 정의된 다른 변수의 수정을 허용하는 원시 포인터(raw pointer)를 얻을 수 있다.
		- 이 방식으로 문제가 있는 확장은 캡슐화된 값에 액세스하거나 변경이 가능하다.
	- 많은 개발자들이 복잡하고 무거운 연산을 위해 네이티브 확장을 사용하는 것을 고려하면, API의 기본 동작이 확장을 동기적으로 호출하는 것($M_{12}$)이 다소 놀라운 포인트이다.
		- 즉, 네이티브 확장이 연산 할 때 스크립트 언어의 메인 스레드는 차단된다.
		- 이는 공격자가 Node.js에서 확장 프로그램이 수행하는 작업량을 제어할 수 있는 경우 심각한 가용성 문제가 발생된다는 것을 말한다.

- **Low-level issues**
	- 실망스럽게도 N-API에는 전형적인(textbook) 버퍼 오버플로우를 이용하여 네이티브 확장에 정의된 지역 변수를 덮어쓸 수(overwrite) 있다.
	- 또한 use-after-free($M_{14}$)도 대부분 언어에서 허용되지만 Ruby는 해체된 메모리 영역을 null 바이트로 초기화시킨다(초기화되지 않은 메모리($M_9$)의 경우 유사한 동작 관찰).
	- double free($M_{15}$)는 항상 코어 덤프를 트리거하며 형식 문자열 취약점($M_{17}$)은 일반적으로 컴파일러에 의해 방지된다.
		- Node.js에서는 경고만 생성. 다른 언어에서는 컴파일 중단
	- 어떤 API도 확장 프로그램 코드 자체에서 메모리 누수를 방지하거나 감지하기 위한 노력을 기울이지 않는다. ($M_{16}$)
	- 
---


## 4. Methodology

![Figure 2](BilingualProblems_F2.png)

- 네이티브 확장이 웹 애플리케이션에 직접 통합될 수는 인지만, 먼저 확장 프로그램이 패키지 내부에 캡슐화되는 것이 일반적이라고 생각한다.
- 본 연구에서는 네이티브 API 오용 취약점을 탐지하기 위한 두 레벨의 정적 분석을 제안한다.
- Fig.2에서는 Node.js와 npm 분석 파이프라인을 나타낸다. 이는 다른 스크립트 언어와 그 생태계에도 적용 가능할 것이다.
- package-level analysis: strong attacker model 하의 안전하지 않은 네이티브 확장으로 인해 발생하는 npm 취약 패키지를 탐지 👉🏻 intra-procedural analyses & cross-language analyses
	- 언어 간 경계에서 C/C++과 JavaScript 코드에 대한 공통된 표현을 만듦
	- 취약 패키지를 찾고, inter-procedural backward data-flow analysis를 통해 애플리케이션에 미치는 영향을 연구. (weak attacker model)
---

### 4.1 Packagae analysis

- 대부분의 네이티브 확장의 사이즈가 작고 많은 오용 사례가 흐름 문제로 형식화되기 때문에, 본 연구에서는 ==data-flow graph==의 ==graph traversal problem==으로 오용을 탐지 한다.
- 또한 스크립트 언어의 upper layer에서 어떻게 데이터가 다뤄지는지 정보가 없기 때문에 발생하는 FP를 방지하고자 두 언어 간의 data-flow를 합친다(unify).

- **Intra-procedural analysis**
	- 단일 함수 내부에서의 데이터 흐름을 분석하여 취약점을 찾는다.
	- Data-flow graph 생성
		- 분석의 첫 단계로 타겟 함수의 그래프를 생성
		- 노드(Nodes, $N$): 프로그램의 구문(line)
		- 엣지(Edges, $E$): 데이터의 명시적인 흐름
	- 핵심 요소 정의
		- $n_0$ (Root Node): 함수 정의 부분으로, 그래프 탐색의 시작점
		- $S$ (Sink): 보안상 위험할 수 있는 지점(API 호출 등)
		- $\bar{S}$ (Sanitizer): 데이터의 유효성을 검증하여 싱크로의 흐름을 안전하게 만드는 코드(e.g., 타입 체크)
	- 취약점 판정 로직
		- 루트에서 싱크로 가는 경로가 존재하고, 그 경로상에 새니타이저가 존재하지 않을 때 취약점으로 보고
		- 경로 비민감성(Path-insensitive): 분석의 효율성을 위해 소스에서 싱크로 가는 경로 중 하나라도 새니타이저를 거친다면 해당 흐름은 안전한 것으로 간주하는 실용적인 접근을 취함

- **Cross-language analysis**
	- ![Figure 3](BilingualProblems_F3.png)
	- ![Algorithm 2](BilingualProblems_A2.png)
	- JavaScript와 C/C++ 사이의 경계를 넘나드는 데이터 흐름을 추적한다. 이는 JS 단에서 이미 검증(Sanitizer)된 데이터가 C/C++로 넘어갈 때 오탐(FP)을 줄이기 위함이다.
	- 경계 식별 (Mapping)
		- JS 함수명("foo")과 C/C++ 함수명(Foo)을 연결해주는 API 호출(**napi_define_properties**, **Set**)을 식별한다.
	- 그래프 병합 (Merging)
		- 매핑으로 확인한 후, JS 그래프의 네이티브 함수 호출 노드에서 C/C++ 함수 정의 노드로 엣지를 추가하여 두 그래프를 하나로 합친다.
	- 통합 분석
		- 합쳐진 그래프 상에서 다시 Intra-procedural analysis'를 수행한다.
		- Ex. JS 쪽($JS3$)에서 타입 체크(Sanitizer)를 수행했다면, C/C++ 쪽($C7$)에 체크 로직이 없더라도 안전한 것으로 판단한다.

- **Implementation details**
	- 도구 활용
		- C/C++: ==Joern==을 사용하여 Code Property Graph를 생성하고 ==dot 파일==로 추출한다.
		- JavaScript: ==Google Closure Compiler==를 수정하여 내부 표현식에서 ==정의-사용(def-use) 쌍을 추출==한다.
	- 분석 과정
		1. JS 코드를 분석하여 C/C++ 함수가 호출되는 지점을 찾는다.
		2. C/C++ 코드를 분석하여 바인딩 API를 통해 실제 호출되는 네이티브 함수를 찾는다.
		3. 두 그래프를 병합하고 보안 위반을 탐지한다.
		4. 패키지 당 분석 시간 제한(Budget)은 15분으로 설정한다.

- **Security Modelling**
	- 타겟 선정: 본 연구에서는 주로 누락된 타입 체크(Missing type checks, $M_3$, $M_4$)를 탐지하는 데 집중한다.
	- 싱크 및 새니타이저 정의
		- 싱크($S$): **napi_get_value_int32**와 같은 N-API 함수들.
		- 새니타이저($\bar{S}$): **typeof**와 같은 언어별 관용적 타입 체크 구문이나 API.
---

### 4.2 Application analysis

- 패키지 분석에서 발견된 취약점이 실제 Node.js 웹 애플이케이션에서 악용 가능한지(Exploitable) 확인하는 단계. 이를 위해 자체 프레임워크 개발: ==FLOWJS==

- **Rule specification**
	- 분석 도구(FLOWJS)가 무엇을 찾아야 하는지 정의
		- 구성 요소: 관심 있는 API(함수 이름)와 파라미터, 그리고 오용 여부를 판단하는 콜백 함수(**IsMisuse**)로 구성
		- Ex. **sqlite3** 패키지의 **run(query, data)** 함수에서 두 번째 인자(**data**)가 사용자 입력(네트워크 요청 등)으로부터 오염되었는지 확인하는 규칙을 작성

- **Intra-procedural backward data-flow analysis** (==절차 내-==)
	- 특정 API Sink에서부터 거꾸로 데이터를 추적하여 Source를 찾는다.
	- 기반 기술: Google Closure Compiler의 내부 데이터 흐름 분석 프레임워크(Worklist 알고리즘)를 기반으로 한다.
	- 분석 방식
		- Def-Use 분석: 변수가 어디서 정의(Write)되었고 어디서 사용(Read)되었는지 관계를 추적
		- 직접 영향(Direct influences) 중심: 외부 네트워크 입력과 같은 원시 입력(Raw inputs)을 찾는 것이 목표이므로, 복잡한 함수 호출을 건너뛰고 직접적인 데이터 정의만 추적하여 효율성을 높였다.

- **Call-graph generation**
	- 함수 간의 호출 관계(Caller-Callee)를 파악한다.
	- 방식: Google Closure의 ==AST 순회 알고리즘==을 사용하여 함수 정의와 호출 노드를 찾고 관계를 수집한다.
	- 한계: 이번 프로토타입에서는 함수 Aliasing(같은 함수를 다른 이름으로 부르는 것)은 처리하지 않았다.

- **Inter-procedural backward data-flow analysis** (==절차 간-==)
	- 단일 함수를 넘어, 함수 호출 체인을 따라 상위로 올라가며 데이터를 추적한다.
	- 과정
		1. 타겟 API가 호출된 모든 지점(Call sites)을 찾는다.
		2. 해당 지점에서 '절차 내 분석'을 수행한다.
		3. 호출자(Caller) 함수로 거슬러 올라가며 이 과정을 재귀적으로 반복한다.
		4. 각 단계의 분석 결과를 종합(Stitch)하여 최종적으로 데이터가 어디서 왔는지(e.g., **req.body**) 판단하고, 규칙에 따라 오용 여부를 결정한다.
---

## Discussion

- 