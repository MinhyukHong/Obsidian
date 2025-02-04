
## How to Ensure Software Security?


- 소프트웨어 보안의 취약점을 만들어내는 요소
	① Design Flaws(설계의 오류)  
	② Coding Errors(Insecure coding)  
	③ Configuration Errors  
	④ Insecure Third-Party Components  
	⑤ Complexity  
	⑥ Human Errors  
	⑦ External Factors


- ==Design Flaws==
	- Incorrect Assumptions(잘못된 가정)  
	- Insufficient access control mechanisms  
	- Weak authentication  
	- Data and privacy(기능적인 측면에만 집중)

- ==Coding Errors==
	- Use of deprecated functions(사용이 중단된 함수의 사용)
	- Input validation  
		- e.g. 공격 코드 주입 등을 검증  
	- Race conditions  
		- 여러 개의 프로세스 또는 스레드가 서로의 리소스를 두고 경쟁하다 deadlock이 걸려 죽는 현상  
	- Hard-coded passwords  
		- 웹서버와 DB가 통신하는 과정에서 DB Password를 Hard coding으로 넣는 경우

- ==Configuration Errors==
	- Default setting maintained
	- Improper management of error messages  
		- 외부에서 프레임워크나 라이브러리를 가져다 쓸 경우, 에러가 발생할 때 콘솔에 찍어주는 로그 메시지를 사용자에게 그대로 리턴아여 보여준다. 하지만 메시지 내에는 개인 시스템에 대한 정보가 들어있기 때문에 에러 메시지를 먼저 처리 하고 돌려줘야 한다.

- ==Insecure Third-party Components==
	- Use of vulnerable external libraries/frameworks  
		- 외부의 라이브러리나 가져다쓰는 component/module에 의해서도 취약점을 상속받을 수 있다.  
	- Failure in dependency management  
		- 보안 관련 업데이트를 제대로 반영하지 않을 경우, 본인의 소프트웨어는 고립된다.  
	- Neglecting security updates

- ==Complexity==
- Environmental Changes  
- Complex Code Base  
	- 잘 설계된 소프트웨어란 관리 가능한 수준으로 프로그램을 유지하는 것이다.

---
## How to Secure Software?

우리는 소프트웨어의 취약점을 식별할 수 있어야 한다. -> Program Analysis(프로그램 분석 기법)

---
## Program Analysis

코드와 코드의 구조, 소프트웨어의 행동을 분석하고 조사하여 그 과정에서 잠재적인 보안 상의 위협과 버그를 수정하며 소프트웨어의 보안의 증진시킨다.

> Goal
- 소프트웨어 내부의 취약점을 발견한다.
 - 소프트웨어가 내 *의도대로 올바르게* 동작하는 지를 확인한다.
 - 어떤 소프트웨어의 data breach(데이터 유출)과 사이버 공격으로부터 system damage를 예방한다.

---
## Program Analysis Techniques


### Static Analysis

- Def: 프로그램을 실행시키지 않은 상태에서 코드를 조사하는 기법(**Not running the code**).  
- 주로, **compile-time**이나 **code review** 시에 행한다.  
	- e.g., IDE tool  
- Goals: Detecting syntax errors, semantic errors, vulnerabilities, etc.  
- Types: 패턴 매칭, 컨트롤 플로우, 데이터 플로우, Abstract interpretation, etc.

**Static Analysis - Example(strcpy)**
- unsafe function인 `strcpy`를 사용했기 때문에 IDE를 통해 정적 분석된 에러 메시지이다.
 ![Figure 1](Security&ForensicsTechniques_1.png)
- 왜 `strcpy`가 취약한가?(int = 4byte 라고 가정)
```
char buf[10];
int x;
```
 ![Figure 2](Security&ForensicsTechniques_2.png)
```
strcpy(buf, "14 characters\0");
```

만들어 놓은 10칸의 버퍼에 14칸의 string을 copy하기 때문에 정해진 범위를 넘게 된다.
 ![Figure 3](Security&ForensicsTechniques_3.png)
> [!note] 문제점
 > x는 x에 해당하는 데이터를 사용해야 하지만, 버퍼가 침범했다.  
> "The length of the string is bigger than the size of the buffer." → **Buffer Overflow**(버퍼 오버플로우) 발생  
> 버퍼 오버플로우라는 취약점이 있기 때문에 strcpy를 사용하지 못하게 하는 것이다.


### "왜 문제가 있는 것인가?"

- Memory model for the process
![Figure 4](Security&ForensicsTechniques_4.png)

- HEAP은 동적으로 할당되는 변수들을 저장한다.- e.g., `malloc`, `new`
- STACK은 함수의 "activation record"를 저장한다.- e.g., local variables, etc.

```
int foo(int x){ char buf[10]; strcpy(buf, ....); return x + 12; } int main(){ int ret = foo(10); .... return 0; }​
```

- Activation record for functions
![Figure 5](Security&ForensicsTechniques_5.png)

- `foo()` 함수의 activation record
![Figure 6](Security&ForensicsTechniques_6.png)

만약, `strcpy(buf, "..................1E2B4C5B");`를 한다면, 기존의 return address(돌아가야 하는 주소값)가 다음과 같이 변경되게 된다.
![Figure 7](Security&ForensicsTechniques_7.png)


즉, 다음 이미지와 같이 `foo()` 함수가 끝날 경우 `main()`으로 돌아가는 것이 아닌, 공격자가 자신의 Shell이나 Remote Code Execution을 넣어 놓는다면 `main()`과는 상관이 없는 코드가 실행된다.  
따라서 공격자는 이 서버의 컨트롤을 빼오게 된다.  
- e.g. admin에 가까운 권한, 소켓 open

"Buffer Overflow can change the execution flow of the program."
![Figure 8](Security&ForensicsTechniques_8.png)

따라서, Visual Studio에서는 버퍼 오버플로우를 막기 위해 `strcpy`를 정적으로 식별하고 경고한다.


### Static Analysis Techniques

- Pattern Matching: 특정한 (일치하는)코드가 있는 지 확인  
- Control-flow Analysis: caller-callee relationship을 분석하여서 control-flow graph(CFG) 형태로 표현
- Data-flow Analysis: 어떤 프로그램의 특정 시점에서의 데이터, 변수를 추적하여 시간에 따른 변화를 분석(e.g., taint analysis)

> [!note] Control-flow Analysis
> - 프로그램 내에서 컨트롤이 진행되는 과정에 대해 분석한다.
> - Branch를 기준으로 코드 블럭을 나눈 뒤, 나올 수 있는 가능성들을 기준으로 그래프를 통해 표현한다.
> 
> ![Figure 9](Security&ForensicsTechniques_9.png)

> [!note] Data-flow Analysis
> - 어떠한 데이터가 어디서 시작해서 어디로 들어가는 지(변화하는 과정)를 추적하여 분석하는 기법
> - Forward slicing : source로부터 데이터를 추적
> - Backward slicing : 뒤로부터 데이터를 추적
> ```
>int main() { int sum = 0; int i = 1; // source while (i < 11) { sum = sum + i; i = i + 1; } printf("%d \n", sum);
>printf("%d \n", i); // sink }​
> ```
> ☑️ source: 데이터가 처음 발생한 지점<br>
> ☑️ sink: 발생한 데이터가 사용되는 것


### Prerequisite of Static Analysis

정적 분석은 기본적으로 소스코드를 가지고 있어야만 가능하다.
하지만, 악성코드(malware)의 경우에 소스코드를 공개 받을 수 있을 것인가?
주로 소스코드에 접근하기가 어렵다. → **Reversing**

----
## Reversing


### Build Process

- From Codes to Executables
![Figure 10](Security&ForensicsTechniques_10.png)

- 소스코드를 작성하면 컴파일링과 링킹의 세부적인 과정을 거쳐 .exe 파일(실행 파일)이 탄생한다.
- 하지만 실행 파일만 존재할 경우?(e.g. firmware, malware, etc.)


### Reverse Engineering

- 실행 파일(`.exe`)을 갖고 있을 경우,  이를 REVERSE 하여 다시 소스코드로 돌리는 행위
- Reverse Engineering은 다음을 포함한다:
	- Decompiling (machine codes to high-level language)
	- Disassembly (machine codes to assembly)

![Figure 11](Security&ForensicsTechniques_11.png)


- Tools: IDA Pro, Ghidra, Radare2, Angr, etc.
- Obfuscation & Packing: 원래는 소프트웨어의 지적재산권을 보호하기 위해 만들어졌지만, 정적 분석을 하기 어렵게 만드는 기법이다.


### Obfuscation

- 난독화의 예시 (Obfuscated code)
![Figure 12](Security&ForensicsTechniques_12.png)


### Packing

- 몇 가지 기법을 이용하여 코드를 압축·변형시킨다.  
- 잘 보이지 않게 감춰두었다가, 프로그램이 돌아가기 시작할 때(runtime) 알아서 decoding 혹은 decryption을 하도록 한다.  
-  실제 중요한 부분이 runtime이 되어서야 해독이 되어 돌아가는 구조를 갖는다.  
	- UPX(Ultimate Packer for eXecutables)  
	- Key Stealing  
	- Runtime Decoding  
	- Inline Encryption  
	- Compression
	- Multiple Packing


### Deobfuscation & Unpacking

- 기본적으로 난독화되거나 패킹이 되어 있는 코드들은 **정적으로 검사하는 것이 불가능**하다.  
- 난독화 해제를 위한 툴(**Deobfuscator**): JEB Decompiler, Ponce(IDA Pro plugin), PANDA  
- 난독화와 패킹은 악성코드(malware)를 연구함에 있어 여전히 도전적인 문제이다.

---
## Dynamic Analysis

- Definition: 동적 분석. 프로그램을 실행시키면서, 즉 runtime 중에 프로그램을 분석하는 기법
- How: 프로그램을 실행시키며 그 행동을 모니터링한다.
- Goals: 원하지 않는(수상한) 행동을 감지한다(file systems, registries, networks, etc.).
- Types: Debugging, Sandbox testing, Memory forensics, Hooking.


### vs. Static Analysis
  
- 앞서 언급했듯, 난독화와 패킹은 정적 분석에 있어 굉장히 도전적인 과제이다.
- 하지만, 난독화되었거나 패킹이 된 코드는 실행되기 위해서 그 상태가 해제되어야 한다.
- 난독화나 패킹은 소스코드 자체로 보았을 때 이해하기 어렵지만, 프로그램이 실행되어 런타임에 들어가게 되면 실행되기 위한 unpack이 된다(CPU에서 처리해 주어야 하기 때문).


### Dynamic Analysis - Example

- malware 분석 시에는 반드시 '고립된' 환경(virtual)에서 분석을 해야만 한다.
- Sandbox : 고립된 환경을 만들어 놓는 것
- 동적 분석을 위한 툴: Any.run, VirusTotal, FireEye, Cuckoo.


### Symbolic Execution

- 프로그램을 실행은 시키되, 변수들에 대해 actual value가 아닌 상징적인 value들을 넣어 실행시키는 것이다.
- 단계
	① Symbolic Input 설정
	② Path Exploration(프로그램의 실행 경로 탐사)
	③ Constraint Collection(탐사 과정에서의 제약 조건을 collection)
	④ Constraint Solving(제약조건 해결)
	⑤ Result Analysis(결과 분석)


### Symbolic Execution - Example

```
input x

if x < 10:
	y = x + 1
else: y = x - 1
if y == 10:
	error "Value of y should not be 10"
```

1) Symbolic Inputs  
- assign the symbol X to x.  
  
2) Path Exploration  
- first if-else statement  
- Path1: X<10 True → 'y = X + 1'  
- Path2: X<10 False → 'y = X - 1'  
  
3) Constraint Collection  
- Path1 Constraint: X < 10  
- Path2 Constraint: X >= 10  
  
2-3) Continue(second if statement)  
- 1A: X < 10 && X + 1 == 10
- 1B: X < 10 && X + 1 != 10
- 2A: X >= 10 && X - 1 == 10
- 2B X >= 10 && X - 1 != 10  
  
4) Constraint Solving  
- 1A: X == 9 (Solution of X: 9)  
- 2A: X == 11 (Solution of X: 11)  
  
5) Result Analysis
- Path 1A and 2A meet the condition that triggers errors.


### Symbolic Execution - pros and cons

- **Pros**
	- 실행 가능한 거의 모든 path를 전부 둘러보기 때문에 기본적으로 프로그램 자체를 **넓고 깊게** 살펴볼 수 있다.
	- **취약점이나 버그를 찾을 때 용이**하다.
	- 취약점이나 버그가 발생할 때 사용되는 input value까지도 사용될 수 있다.

- **Cons**
	- 너무 많은 경로 발생: 기본적으로 모든 케이스를 다루기 때문에, 애초에 프로그램이 많은 branch를 가질 경우 상당히 많은 path가 놓이게 되면서 **path explosion**(경로 폭발)에 처하게 된다.
	- malware가 file system이나 네트워크로부터 input을 가져와서 그것을 판단하는 데 사용하는 경우, 사용할 수 없다. 즉, **외부와 상호작용하는 프로그램에 있어서는 뚜렷한 한계**를 지닌다.


### Fuzzing

- Fuzzing 혹은 Fuzz testing은 자동화된 테스팅 기법 중 하나이다. 마찬가지로 소프트웨어 상에 있는 버그나 **취약점**을 찾아내는 조작 기법이다.
- 프로그램을 실행시켜 **unexpected** data, **incorrect** data, **repetitive** data를 주입시켜 시스템이 그것을 어떤 식으로 처리하는 지 지켜본다.
- **정상적인 가정으로부터 벗어난 input**을 주기 때문에 그 경우로부터 발생할 수 있는 bug, crash, failure, memory leak 문제를 체크할 수 있다.


### Stages of Fuzzing

① Target Definition: 어떤 프로그램을 테스트할 것인가?
② Fuzz Generator Configuration: 데이터 생성 형태를 설정
③ Test Execution: Fuzz Generator를 작동시켜 input을 만들어내며 프로그램에 넣어주면서 테스트를 한다.
④ Result Monitoring
⑤ Result Analysis


### Fuzzing - Examples

![Figure 13](Security&ForensicsTechniques_13.png)

![Figure 14](Security&ForensicsTechniques_14.png)


### Fuzzing = Examples (SQL Injection)

1. **Mutation-based(Random) Fuzzing** : 유효한 input을 정해놓고, 그것으로부터 변이를 발생시켜 시스템에 넣는 방식

![Figure 15](Security&ForensicsTechniques_15.png)

2. **Generation-based Fuzzing**(생성 기반 Fuzzing) : 일정한 패턴이나 룰을 집어 넣어 그것을 기반을 fuzzing data를 만들어내는 방식
	- 시스템/보안적으로 좀 더 취약점이 많이 발생하는 부분에 대해 어느 정도 지식을 가지고 룰을 적용시켜 input을 만들어내는 기법

![Figure 16](Security&ForensicsTechniques_16.png)

3. **Coverage-guided Fuzzing** : 테스트 케이스를 던져주고, 그것이 작동할 때 거쳐가는 코드의 coverage를 통해 새로운 generation을 만들어가는 방식. 전체 코드에서 여러 번의 fuzzing을 통해서 시스템이 갖고 있는 최대한 많은 코드 부분에 도달(조사)할 수 있게끔 하는 방식.
	- Code coverage를 측정하기 위해 코드가 있어야 한다.
	- Whitebox Testing: 시스템의 내부를 전부 알고 있다는 가정 하에 테스팅하는 기법
	- Blackbox Testing: 시스템의 내부를 전혀 모르는, 코드가 없는 상태에서 테스팅하는 기법

![Figure 17](Security&ForensicsTechniques_17.png)


### Fuzzing - pros and cons

- **Pros**
	- 사용자의 개입이 상대적으로 적은 기법이다.
	- 기본적인 룰 또는 패턴만 세팅을 해주게 된다면, 사용자가 특별히 **인터랙션하지 않아도** input을 발생시켜 주입하는 과정을 스스로 하게 된다.
	- 굉장히 거대하고 복잡한 시스템에 대해 테스팅할 때에는 빠른 속도로 취약점이나 버그를 찾아낼 수 있다.
	- 사람의 개입이 적기 때문에 굉장히 빠르다(많은 데이터를 빠르게 만들어내고, 테스트를 한다).

- **Cons**
	- 모든 발생할 수 있는 에러에 대해 조사하는 것을 사실상 불가능하다(Random ~ Semi-random).
	- 굉장히 복잡한 버그나, 특정한 상황에서만 발생하는 버그에 대해서는 단순한 랜덤값으로 밝혀내기가 어렵다.
	- The **quality of test cases** greatly affects the efficiency of the testing.