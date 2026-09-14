---
Date: 2026-09-09
topic:
in progress: true
done:
summary:
---
## Milestones

==오탐(FP)보다 미탐(FN)을 줄이는 게 더 중요==

### Tool 비교

- 2024-09-19. 8879 packages -> 100 sampling
- *CHARON*
	- 입력: 100
	- filter 통과/construction 대상: 94
		- fail: CHARON의 사전 filter; C/C++ add-on, JS 코드가 없거나, 사전 정의된 sink가 없어서 분석 대상이 아니라고 판단
	- 취약 가능성 보고: 3
		- `bitcoin-impl`
			- INTEGER_OVERFLOW (addition)
			- PoC: ==FP==
		- `fastredis`
			- INTEGER_OVERFLOW (malloc)
			- MEMORY_CORRUPTION_ALLOCATION_COPY
			- PoC: ==Null dereference==
		- `node-expat-gowhich`
			- OVERFLOW_STRING_OPS
			- PoC: ==FP==
	- -> 위험해 보이는 함수 호출 자체만 보고, 앞뒤 맥락(e.g., buffer 크기 확인 등)은 확인하지 않음.
- *Bilingual Problems-Style*
	- 방법론 정의
		- filter 통과/construction 대상: 88 (failed 6)
		- Implementation: XBind $-$ argument-level matching $-$ 전체 JS input to native 경로 탐색
		- JS boundary caller-native callback 연결
		- 경계 2개 함수의 intra-procedural 그래프만 분석(maxDepth=1)
		- 경로상 sanitizer가 하나라도 있으면 안전으로 판단(path-insensitive 판정) <- sanitizer dominance, argument 연관성 X
	- 
- *XBind*
	- Native sink 탐지(12개): 카테고리별 전용 매칭 함수를 CPG callback scope 내에서 특정 연산자/함수 이름 패턴 매칭(각 취약점별로 CWE 예시나 설명에 등장하는 함수로 정의)
		- ==12개 카테고리 각각 전용 함수, 실제 CWE 데모 예시랑 대조 검증까지 근거 명확==
	- Native sanitizer 탐지
		- ==`dominance` + 카테고리별 raw count 채택 규칙 코드 반영==
		- 작동: Joern `.dominates` API로 조건문이 CFG 상 sink를 거치는지 판단
		- 어떤 조건문은 유효하다고 인정할 것인지: 7개 CWE 실제 NVD 패치 커밋 2,787건에서 신규 추가된 조건문을 정규식으로 추출해서 구문 형태(동등비교 조기리턴/negation/범위비교/단일함수호출/복합/무비교)로 분류하고 카테고리 자체에서 10번 이상 등장하는 형태만 채택
	- JS sanitizer 탐지
		- ==카테고리별 키워드/패턴 기반 판정, REENTRY 비대칭 처리==
		- JS에서 native로 값이 너어가기 전에 걸리는 검증. 근데 JS 체크가 타입/범위는 검증할 수 있지만 메모리 생명주기(소유권/UAF)는 검증할 수 없음.
		- int overflow
		- buffer overflow/memcpy overflow/oob access
		- div by zero
		- format string
		- null deref
		- mem leak/UAF/generic memory safety: JS 측 sanitizer 적용 안 함. (native 코드 내부 소유권/생명주기 문제라서 JS 값 검증으로는 원천적으로 못 막음)
		- 
- *LLMs*
	- 
---


- CHARON - (결과가 0이 아닌 100(~200)만 뽑아서)
- ~~교신저자 메일 보내기~~
- Bilingual Problems 관련:
	- 정확도 측정: 실험 전에 tool을 정의(xbind-인자단위-경로전체) >> discussion에서 변명
	- **MOVERY 구현 참고 (MVP)**
- CWE mapping에서: 10이라는 숫자의 정당성을 설득해야 함. (e.g., 서로 다른 repo 3개 이상, 전체 집합 10개 이상 -> common하게 등장한 애들. 이 숫자에 대한 정당성을 부여해주는 reference를 1~2보여주면 좋음)
- Research Questions
	- RQ1: 최신 버전 툴 적용(JS, native 모든 결과 1장~) + case(appendix로 빼도)
	- RQ2: 기존 기술 비교 (4개끼리 비교) - 패키지 100개 or flow 단위(수동검증 가능한 만큼)
		- LLMs 비교할 때: C sink 함수 (file, line) 제공
	- RQ3: Ablation
	- RQ4: performance

## Action items

- 
---


## Comments

- 
---