
## Why security?

> [!note] Case 1. 
> • Microsoft Exchange Server Exploits (Mar, 2021) by Ahfnium  
> 공격자들(Attackers)은 제로 데이 취약점을 악용하여 원격 코드 실행을 통해 Exchange 서버를 장악했다.  
> 결과: 피해를 입은 기업, 정부, 교육 기관 등에서 계정이 침해되고 데이터 유출이 발생했다.
> 
> ![Figure 1](../assets/images/SecurityBasics_1.png)

> [!note] Case 2.
> • Colonial Pipeline **Ransomware** (May, 2021) by DarkSide  
> 파이프라인 회사는 랜섬웨어에 의해 손상되었고 모든 운영을 중단했다(다크 웹에 의해 발생).  
> ~80%의 주유소는 연료가 바닥났다(Federal Emergency).  
> 결과: $4.4M의 비트코인을 공격자들에게 지불하고 종결.
>
> ![Figure 2](../assets/images/SecurityBasics_2.png)
>
> ☑️ **ransomeware**: 파일이나 시스템을 lock. 특정한 암호를 입력하지 않고는 파일을 열지 못하거나 시스템을 사용하지 못하게 하는 악성코드의 일종.

> [!note] Case 3.
> • SolarWinds SunBurst Malware (2019-2021) by Cozy Bear(**APT**29)  
> SolarWinds Orion: Network management/monitoring program.  
> Orion은 Fortune 500대 기업 중 400개 이상의 기업에서 사용하는 인기 있는 솔루션이다.  
> 오리온의 업데이트/배포 루틴에 공격자들이 침입하여 다음 번 업데이트에 악성코드를 넣음으로써 오리온을 사용하는 모든 기업의 프로그램에 업데이트를 적용시켰다.  
> Software Supply Chain 공격: 소프트웨어가 공급되는 공급망 어딘가에 공격을 받는다면, 그것을 사용하는 모든 entity들이 동시에 영향을 받는 공격 기법.
>
> ![Figure 3](../assets/images/SecurityBasics_3.png)
>
> ☑️  **Advanced Persistent Threat**: 장기적으로 특정 타겟을 공격하는 집단

---
## Security Really Matters

- 사이버 보안 문제로 급증한 재정적 손실
![Figure 4](../assets/images/SecurityBasics_4.png)

위와 같은 미국 내에서의 피해 뿐만 아니라, 91% 이상의 조직/기업이 한 번 이상 사이버 보안 사고나 데이터 유출을 보고했다.

---
## CIA Triads

- 우리가 사이버 보안을 통해 보호하고자 하는 것에 대한 3가지 개념
![Figure 5](../assets/images/SecurityBasics_5.png)

- **CIA**: Confidentiality(기밀성), Integrity(무결성; 데이터가 왜곡되지 않음), Availability(가용성)
- CIAAAAA: Authenticity, Anonymity, Authorization, Auditing

> [!note] 'C' - Confidentiality
> "The concealment of information or resources"  
> 정보나 자원을 외부로부터 숨기는 것. 파일의 내용뿐만 아니라 존재한다는 사실 또한 숨긴다.  
>
> - 누가 데이터를 접근/사용할 권한이 있는가?  
> - 콘텐츠와 존재 여부 모두  
> - 접근 제어 기법
> 	- Permissions: 특정한 권한을 주는 것 
> 	- Whitelists/Blacklists: 정보 접근 허용/차단  
> 	- Cryptography: 암호화 기법

> [!note] 'I' - Integrity
> "The trustworthiness of data or resources"  
> 우리가 사실이라고 믿고 있는 데이터나 정보들이 정말로 믿을 만한가?
> - 데이터가 신뢰할 만한가?
> - 데이터와 출처의 무결성
> 	- 만일 누군가가 데이터를 업데이트했다면, 그는 인증된 사람인가?
> - Prevention & Detection(예방 & 탐지 기법)
> 	- Prevention: 검증되지 않은 제3의 사람이 와서 데이터를 변경시키는 것을 Block시키는 것(access control).
> 	- Detection: 잘 막았음에도, 데이터 자체에 손상이 발생할 경우 복원하는 것(**Checksum, hash**)
> 
> ☑️ checksum: 중복 검사의 한 형태로, 오류 정정을 통해, 공간(전자 통신)이나 시간(기억 장치) 속에서 송신된 자료의 무결성을 보호하는 방법.
> ☑️  hash: 임의의 데이터를 고유한 고정된 크기의 값으로 변환하여 데이터의 무결성을 검증하고 보안적으로 사용.

> [!note] 'A' - Availability
> "The ability to use the information or resource desired"  
> 정보나 리소스를 사용하고 싶을 때 사용할 수 있는 능력
> - 데이터에 원할 때마다 접근할 수 있는가?  
> - 가용하지 않은 시스템은 차라리 없는 것보다 나쁜 것(사용가능성을 유지해주는 것도 보안에 있어서 중요하다).  
> - Denial of Service(**DoS, DDoS 공격 기법**)
> 	- 굉장히 많은 리퀘스트를 넣는다. 서버가 처리할 수 있는 리퀘스트의 한도가 있는데(네트워드나 컴퓨팅 리소스에 의한), 너무 많은 리퀘스트가 몰려올 경우 처리하지 못함
> 	- 가용성을 떨어뜨리려는 시도(degrade availability)
> 	- 구별하기 어렵기 때문에 해결책이 없음(the hug of death, traffic spike): 양성적인 반응인지, DDoS 공격에 의해서인 지를 구분하는 것이 여전히 이슈로 남는다.
> 

### CIA의 Balance를 유지하는 것
*기밀성, 무결성, 가용성(CIA)의 균형*

- C vs. I + A(기밀성 대 가용성 + 무결성): 인터넷에서 기계를 격리(연결 해제).
- 기밀성을 개선.
- 무결성 약화(업데이트 손실) 및 가용성.
<br>
- I vs. C + A(무결성 대 기밀성 + 가용성): 여러 사람/시스템에 의한 철저한 데이터 확인을 수행.
- 무결성을 개성.
- 기밀성과 가용성을 약화(검증 중인 데이터에 대한 잠금)
- e.g. 암호화폐

---
## Threats and Attacks

> [!note] Terms
> - 취약점(Vulnerability): 악용될 수 있는 약점
> - 위협(Threat): 피해를 일으킬 수 있는 잠재력이 있는 상황
> - 공격(Attack): 보안을 침해하는 잠재적인 상황, 즉 위협을 실제로 발생시키는 상황
> 


- **Threats**: *위협의 4가지 종류*
	- 공개(Disclosure): 어떠한 정보나 자산에 대한 허가받지 않은 접근; Attack on C(기밀성에 대한 공격)  
	- 사기(Deception): 거짓된 데이터를 수락하는 상태(정직해야 할 데이터를 위조); Attack on I(무결성에 대한 공격)  
	- 방해(Disruption): 정상적으로 올바른 행동을 해야하는 시스템을 방해하는 행위; Attack on A(가용성에 대한 공격)  
	- 탈취(Usurpation): 시스템의 일부 또는 전체가 공격자에 의해 탈취(강탈)된 상황; Attack on C, I, A


- **Attacks**: *공격*
	- ==Eavesdropping / Wiretapping / Snooping / Sniffing: 도청==
		- 정보에 대해 허가 받지 않은 접근을 하는 행위  
		- 데이터나 통신, 커뮤니케이션이 허가 받지 않은 사람에 의해 접근이 되고, 그 내용이 빠져나가는 것  
		- Packet sniffer 혹은 wiretapper를 이용  
		- 다른 사람의 시스템에 들어가 불법으로 파일이나 프로그램을 복제  
		- **Disclosure Threat**에 해당  
		- 기밀성을 위협하는 공격 기법이자, **기밀성**이 제대로 지켜진다면 막아낼 수 있다.
	- ==Modification / Alteration: 변조==
		- 통신을 할 때, 공격자가 message flow를 중단  
		- 흐름을 지연시키거나 수정한 후에 보냄(**Salami; 살라미 공격**)  
		- 수정한 메시지를 다시 보냄  
		- Deception과 Usurpation에 해당  
		- 데이터의 **무결성**을 확립함으로써 counter가 가능하다.
	- ==Fabrication / Replay: 날조==
		- 메시지를 copy해서 보내는 방식  
		- 똑같은 메시지를 계속해서 반복함으로써 피해를 주는 기법(refund the money, stop the system)  
		- Deception과 Usurpation에 해당  
		- 데이터의 **무결성**을 확립함으로써 counter가 가능하다(추가적인 검증 과정).
	- ==Masquerading / Spoofing / Impersonation / Identity Theft: 도용==
		- 타인의 신원을 도용하여 사용하는 케이스들의 공격  
		- 타인의 신원을 가장  
		- Passive or active  
		- Delegation(위임)과 구분할 필요성이 있다.  
		- Deception과 Usurpation에 해당  
		- 데이터의 **무결성**을 확립함으로써 counter가 가능하다.
	- ==Delay / Denial of Service(DoS)==
		- 서버 시스템에서 사용하는 리소스를 포화(Saturation)시키는 것(리소스; bandwidth, CPU, memory, etc.)  
		- 리소스를 고갈시켜 정상적인 작동을 막는 것  
		- 일시적인 경우(Delay), long-term일 경우(DoS)  
		- Disruption과 Usurpation에 해당  
		- 가용성을 해치는 공격임과 동시에, 충분한 **가용성**을 확립함으로써 counter가 가능하다.
	- ==Repudiation: 부인==
	- Repudiation of Origin / Delivery / Receipt  
	- 무엇인가를 인정하는 것을 거부  
	- "I never sent it", or "I never received it"  
	- 추가적인 인증(PIN, 생체인증)을 통해 부인을 예방  
	- Deception에 해당  
	- 보내고 도착하는 과정까지를 서버에서 검증, 즉 데이터의 **무결성**을 확립함으로써 counter가 가능하다.

> [!note] Impact of Attacks
> - 기밀 도난
> - 서버 시스템이 가지고 있는 리소스(bandwidth, computing resource)가 허가 받지 않은 자에 의해 사용
> - 잘못된 정보의 확산(misinformation)
> - 정상적인 서비스의 방해
> 

---
## How to make it secure?

> **Design Principles**

- **Simplicity**
	- 프로그램을 단순화한다.
	- 불일치가 일어날 수 있는 가능성이 줄어든다.
	- 이해가 쉽기에 해결 또한 쉽다.

- **Restriction**
	- 액세스를 최소화한다.
	- 커뮤니케이션을 억제한다.

- **Least Privilege**
	- 모든 사용자들은 최소한의 권한만 가지고 접근해야 한다.

- **Fail-safe defaults**
	- 접근 권한에 대해 decision을 내릴 때, '거절'을 default로 설계한다.
	- 모두를 block, 허가된 사용자에게만 permission.

- **Economy of mechanism**
	- 모듈을 간단하고 작게 만든다.

- **Compromise recording**
	- 오류의 가능성을 인정한다.
	- 데이터의 loss나 시스템의 문제가 발생했을 때, 기록한다.
	- 보안 문제를 염두해둔다.

- **Complete mediation**
	- 사용하는 시스템이 정보나 object에 관련된 모든 접근들은 매번 인가여부를 check.
	- Zero Trust(Trust No One, Verify Everything)

- **Separation of privilege**
	- 최소한의 권한을 여러 명이서 나눈다.
	- 데이터에 대한 조작은 여러 명이서 분할하는 것이 안전하다.

- **Open design**
	- 디자인을 가급적이면 열어 놓는다.
	- 오픈소스로 공개함으로써 취약점을 빠르게 캐치하기 위함이다.

- **Least common mechanism**
	- 여러 사용자에게 공통으로 사용되고 모든 사용자에게 의존되는 메커니즘의 양을 최소화한다.

- **Psychological acceptability**
	- 사용자 인터페이스는 사용 편의성을 위해 설계되어 사용자가 보호 메커니즘을 일상적으로 자동으로 올바르게 적용할 수 있어야 한다.

- **Work factor**
	- 잠재적인 공격자가 사용해야 하는 리소스를 추정하고 만든다.

---
## Other Key Concepts

==Vulnerabilities==
- 0-day vulnerabilities  
	- 공개와 패치가 되지 않은, 잠재되어 있는 소프트웨어/하드웨어 취약점  
	- 심각한 결과를 초래한다.
- N-day vulnerabilites  
	- 이미 대중들에게 알려진, 또는 개발자들에 의해 패치된 소프트웨어/하드웨어 취약점


==Authorization(인가)==
- 인증이 되어 있는 사람에게 실제로 권한을 주는 과정(**determining the actions or permissions**)  
- 주어진 사람에 대해 그 사람이 할 수 있는 특정한 리소스에 대한 허가를 결정하는 과정  
- 인증 후에 일어나게 되는 과정