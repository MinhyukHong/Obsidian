---
reporting date: 2025-03-20
reading: 
done: 
summary:
---
## Reference
---
[BleepingComputer](https://www.bleepingcomputer.com/news/security/ransomhub-ransomware-uses-new-betruger-multi-function-backdoor/)


## Contents
---
**Betruger 백도어 등장**
- RansomHub 랜섬웨어 공격에서 사용된 새로운 맞춤형 백도어 *Betruger*가 발견되었다.
- 이 백도어는 단순한 랜섬웨어 배포 도구가 아니라, 다기능 악성코드로 설계되었다.

**Betruger의 기능**
- 키로깅(Keylogging)
- 네트워크 스캔
- 권한 상승(Privilege Escalation)
- 크리덴셜 덤프(Credential Dumping)
- 스크린샷 캡처
- C2 서버로 파일 업로드
- 일반적으로 랜섬웨어 공격 전 사용되는 Mimikatz, Cobalt, Strike 같은 도구 대신, 자체 개발된 악성코드를 활용하여 탐지를 피하려는 전략이다.

**배포 방식**
- 공격자는 `mailer.exe` 및 `turbomailer.exe`라는 파일명을 사용하여 Betruger를 정당한 메일링 관련 앱처럼 위장한다.

**RansomHub 랜섬웨어 그룹**
- 과거 *Cyclops* 및 *Knight*로 알려졌으며, 2024년 2월부터 활동했다.
- 데이터 암호화보다는 데이터 절취 및 협박(extortion) 중심의 공격을 수행한다.
- 주요 피해 조직:
	- Halliburton - 석유 서비스
	- Christie's - 경매 회사
	- Frontier Communications - 미국 통신사
	- Rite Aid - 약국 체인
	- Kawasaki - EU 지사
	- Planned Parenthood - 비영리단체
	- Bologna FC - 축구 클럽
- BlackCat, 즉 AlphaV 그룹의 $2,200만 달러 exit scam 이후, Change Healthcare의 데이터를 유출했다.
- 최근에는 BayMark Health Services를 해킹했다고 주장했다.

**FBI 발표**
- RansomHub 소속 해커들은 미국의 주요 인프라 부문을 포함하여 200개 이상의 피해 조직을 해킹했다.
- 공격 대상: 정부, 중요 인프라, 의료 기관, etc.


## Discussion
---
Betruger 백도어의 발견은 랜섬웨어 공격 방식의 변화를 보여준다. 기존에는 Mimikatz나 Cobalt Strike 같은 공개 도구를 활용했지만, RansomHub는 자체 맞춤형 악성코드를 사용해 탐지를 피하고 공격 단계를 간소화하고 있다. 이는 랜섬웨어 공격이 점점 더 정교해지고 있음을 시사하며, 보안 솔루션의 대응 방식도 변화가 필요함을 의미한다. 특히, 정부 및 의료 기관과 같은 주요 인프라를 표적으로 삼는 RansomHub의 활동은 큰 위협이 될 수 있다. 향후 이와 같은 맞춤형 악성코드를 활용한 랜섬웨어 공격이 증가할 가능성이 높아, 보안 업계의 지속적인 모니터링과 대응이 필수적이다.