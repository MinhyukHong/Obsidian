
## Computer Network

데이터를 교환하거나, 서로 간 리소스를 공유할 수 있는 상호 연결된 컴퓨팅 디바이스들의 집합.
이 디바이스들은 컴퓨터, 서버, 모바일 장치에서 사물인터넷(IoT) 장치에 이르기까지 다양하며, 이더넷, Wi-Fi, Bluetooth와 같은 다양한 유선 또는 무선 네트워킹 기술을 통해 연결된다.

---
## Encryption(crytography)


### Encryption (암호화)

- 데이터를 보호하기 위한 기술. Original form(plain text/clear text)을 사람이 읽을 수 없는 ciphertext로 바꾸는 것
- Encryption algorithm(cipher)을 사용하게 된다. 암호화를 사용하기 위해 사용하는 중요한 값들을 **Key**라 하며 key를 통해 **암호화(encryption)** 와 **복호화(decryption)** 과정을 거치게 된다.

![Figure 1](../assets/images/NetworkSecurity_1.png)

---
## Symmetric Encryption

- 암호화와 복호화 과정에서 **동일한 key**를 사용하는 것이다.
- 대칭형 암호화의 경우, **shared secret**을 사용한다.

![Figure 2](../assets/images/NetworkSecurity_2.png)

> [!note] Encryption Algorithms
> -  Advanced Encryption Standard(AES)
> - Data Encryption Standard(DES)
> 
> 👉🏻  Aplications
> - File and Disk encryption  
> - Database encryption  
> - Payment Transactions(POS systems and ATMs)  
> 
> → 공통점: 암호화와 복호화를 하는 주체가 명확하다. 즉, 한정된 사용자들이 시스템에 접근한다.


### Symmetric Encryption: Key Distribution

대칭 키를 참여하는 *피어 간에 교환*하는 방법
- 물리적으로 안전한 채널: USB 플래시 드라이브
- **디피-헬만 알고리즘**: 수학적 접근 방식 (Man-in-the-Middle 공격에 취약)
- 키 관리 인프라(KMI): 신뢰할 수 있는 제3자

---
## Asymmetric Encryption

- Asymmetric key encryption(= public key encryption). 데이터를 암호화, 복호화할 때 쌍으로 된 두 개의 key를 사용한다.
- 암호화 키(public key)와 복호화 키(private key)는 수학적으로 연결되어 있다.


### Asymmetric Encryption: Keys

- Public Key: 공공 정보. 공개하는 키를 의미한다.
	- public key를 통해서 암호화가 된 메시지는 반드시 private key를 통해서 복호화가 가능하다.

- Private Key: 비밀 정보. 공개되어서는 안 되는 키를 의미한다.
	- private key를 통해서 암호화가 된 메시지는 반드시 public key를 통해서 복호화가 가능하다.


### Asymmetric Encryption: Encryption

![Figure 3](../assets/images/NetworkSecurity_3.png)

- 암호화와 복호화 과정 모두에서 사용되는 key는 기본적으로 **수신자(recipient)의 key**이다.

👉🏻 **Example**
Alice → Bob: Bob's public (encryption) and private (decryption) keys
Bob → Alice: Alice's public and private keys


### Asymmetric Encryption: Digital Signature

![Figure 4](../assets/images/NetworkSecurity_4.png)

- 암호화와 복호화 과정 모두에서 사용되는 key는 기본적으로 **송신자(sender)의 key**이다.

👉🏻 **Example**
Alice → Bob: Alice's private (encryption) and public (decryption) keys
Bob → Alice: Bob's public and private keys


---
### Asymmetric Encryption: PKI

- Public Key Infrastructure(PKI)
![Figure 5](../assets/images/NetworkSecurity_5.png)


### Symmetric vs. Asymmetric

- Symmetric Encryption  
	- Pros: 빠르고 효율적인 알고리즘이다.  
	- Cons: 키를 교환/관리하는 과정에서 어려움이 따른다.  
  
- Asymmetric Encryption  
	- Pros: 더 안전하며 키 관리가 용이하다.  
	- Cons: 느리고 비효율적이다(PKI와 같은 3rd party authority가 필요한 경우).

---
## Hashing(One-way Encryption)

- 어떠한 길이의 input을 hash라는 과정에 넣는다면 항상 **fixed-size string**(고정된 길이)의 output이 나온다.
- 이 output은 hash value, hash code, hash라고 부른다.
- input에서 output을 만드는 변환 과정에 사용되는 함수들을 **hash function**, 혹은 **message digest function**이라 부른다(e.g., SHA-256, MD5).


### Hashing: Properties

① Deterministic: 동일한 input을 넣으면 그 결과값(hash value)은 항상 동일해야 한다.
② Fast Computation: O(1)의 계산 속도로 결과를 도출한다.
**③ Pre-image Resistance**: 특정한 hash value(변환된 값)을 알고 있을 때, 이를 통해 원본의 값을 추측하는 것은 불가능하다.
④ Avalanche Effect: 주어지는 input의 값이 조금이라도 바뀔 시, 그 결과값은 완전히 다른 string이 나오게 된다.
⑤ Collision Resistance: 서로 다른 input에 대해서 동일한 hash value를 갖는 것이고, 이를 최소화시키는 것이 hash의 특징이기도 하다.
⑥ Uniform Distrubution: hash의 결과로부터 나오는 space의 결과값의 분포는 uniform distribution을 따르게 된다.


### Hashing: Examples

**1) Data Integrity Verification**(데이터의 무결성 검증)  
- 데이터의 변경 여부를 체크  
- 예를 들어, 파일을 다운로드한 후, 파일의 해시를 신뢰할 수 있는 소스와 대조하여 파일이 손상되거나 변조되지 않았는지 확인할 수 있다.  
  
**2) Password Storage**  
- 대부분의 시스템은 비밀번호를 평문으로 저장하는 대신 해시된 버전을 저장한다.  
- 이렇게 하면 저장소가 손상되더라도 실제 비밀번호를 쉽게 복구할 수 없다.  
  
**3) Cryptography & Digital Signatures**  
- 해시 함수는 암호화 알고리즘과 함께 작동하여 디지털 서명에 고유성을 제공한다.  
- 해시 함수는 메시지의 요약본을 생성하여 이를 메시지에 안전하게 첨부할 수 있다.  
  
**4) Data Retrieval**  
- 해시 함수는 해시 테이블과 같은 데이터 구조에서 사용되며, 이는 데이터베이스 **인덱싱**에서 빠른 데이터 검색을 위해 중요하다.  
  
**5) Blockchain & Cryptocurrencies**  
- 블록체인은 해시 함수를 사용하여 각 블록에 고유 식별자를 생성하고, 블록 체인 내 블록 간의 연결을 안전하게 한다.  
- 이전 블록에 대한 해시값을 다음 블록이 가지며, 해시를 original로 돌리지 않은 이상 이전 블록을 수정하는 것은 거의 불가능하다.

---
## Encrypted Network


### Network Protocol

- 여러 개의 디바이스들이 존재할 때, 이들이 통신하기 위해서 어떠한 룰과 컨벤션들을 사용할 지 정해 놓은 것.
- 이는 두 개 이상의 장치가 네트워크를 통해 정보를 성공적으로 전송하기 위해 준수해야 하는 프로세스, 요구 사항, 데이터 형식을 포함한다.


### Network Protocol: OSI 7 layers

![Figure 6](../assets/images/NetworkSecurity_6.png)


### Network Protocol: Problems

- **Old-fashioned protocols**(e.g., HTTP, FTP, Telnet, etc.)는 충분히 안전하지 않다.
- 전송되는 데이터에 대해 **암호화를 제공하지 않는다**.
- 여러 사이버 공격에 대해 **취약하다**.


### Man-in-the-Middle (MITM)

- 네트워크 트래픽이 **암호화되지 않으면** 공격자가 통신을 가로채거나 조작할 수 있다.
- 공격자는 통신하는 두 당사자 간의 데이터를 **관찰**하고 **잠재적으로 변경**할 수 있다.
- 예를 들어, **login credential**과 **개인 정보**가 암호화되지 않은 HTTP 세션을 통해 노출될 수 있다.

![Figure 7](../assets/images/NetworkSecurity_7.png)


### Packet Sniffing

- 이 유형의 **사이버 도청(cyber eavesdropping)** 은 네트워크를 통해 이동하는 데이터 패킷을 캡처하는 것을 포함한다.
- 암호화되지 않은 패킷은 스니핑될 때 공격자에게 **민감한 정보**를 제공할 수 있다.


### DNS Spoofing (DNS Manipulation)

- DNS 쿼리가 암호화되지 않으면 공격자가 위조된 DNS 응답으로 **사용자를 악성 사이트로 리디렉션**할 수 있다.
- 이는 **인증 자격 증명 도용(theft of authentication credentials)** 이나 **악성 소프트웨어 배포**로 이어질 수 있다.

![Figure 8](../assets/images/NetworkSecurity_8.png)


### Session Hijacking

- 공격자는 **암호화되지 않은 쿠키나 세션 토큰을 가로채어 사용자의 세션을 탈취**하고 그들의 권한에 접근한다(공공 와이파이에서).

![Figure 9](../assets/images/NetworkSecurity_9.png)

---
## Solutions: Encrypted Protocols

- Encryption & Authentication
- 데이터 암호화를 지원하는 수많은 네트워크 프로토콜이 존재한다.

> [!note] Encrypted Protocols
> - HTTP → **HTTPS (HTTP + SSL/TLS)**
> - **Telnet**  →  **SSH**
> - FTP → **SFTP (FTP over SSH) / FTPS (FTP + SSL/TLS)**
> - SMTP → **SMTPS with STARTTLS (SMTP + SSL/TLS)**
> - DNS → **DNSSec**
> 

---
## Firewall & VPN


### Firewall

- 방화벽은 네트워크 간의 관문 역할을 하며, 일반적으로 내부 네트워크와 인터넷 사이에 위치한다.
- 미리 정의된 규칙 세트를 기반으로 네트워크 트래픽을 제어한다.
- 이 규칙은 IP 주소, 포트 번호, 프로토콜 등의 기준에 따라 허용되는 트래픽과 차단되는 트래픽을 명시할 수 있으며, 내부 및 외부 트래픽의 보안을 위해 사용된다.


### Firewall: Example (Packet Filtering)

![Figure 10](../assets/images/NetworkSecurity_10.png)


### Packet Filtering Firewall (1st gen)

![Figure 11](../assets/images/NetworkSecurity_11.png)

- 패킷 필터링 방화벽은 **패킷의 헤더 정보를 검사**하고, **소스 주소와 포트**를 확인한 후에 목적지 주소와 포트에 대한 접근을 허용할지 여부를 결정한다.
- OSI Layers: Layer 3(**Network** Layer), Layer 4(**Transport** Layer)
- 이 방화벽은 보통 하위 계층에서 작동하며 비교적 **빠르고** 기존 애플리케이션과 **쉽게 통합될 수 있다**.
- **하드웨어에 의존하지 않지만** 강력한 로깅 기능이나 사용자 인증을 기대하기는 어렵다.
- 이 방화벽은 **연결 상태**를 고려하지 않는다.


### Statefull Firewall (2nd gen)

![Figure 12](../assets/images/NetworkSecurity_12.png)

- 패킷 필터링 방화벽은 빠르지만 많은 규칙이 있는 경우 모든 들어오는 패킷과 나가는 패킷을 조사해야 하므로 큰 부담이 될 수 있다.
- 상태 기반 방화벽은 트래픽의 ==session==을 모니터링한다(타임아웃 포함).
- ==context(상황)==에 기반하여 트래픽을 필터링한다(TCP 핸드셰이크 → 허용된 트래픽).
- ==세션== 정보를 유지하기 때문에, 상태 기반 방화벽은 패킷 필터링 방화벽보다 **효율적**이다.
- 여전히 **IP와 포트**에 따라 필터링을 수행한다.
- OSI Layers: Layer 3 (**Network** Layer), Layer 4 (**Transport** Layer)


### (Web) Application Firewall (3rd gen)

- 패킷 필터링과 상태 기반 방화벽의 **한계**  
	- 일반적으로 서비스 제공자들은 모든 서비스 관련 포트를 **허용**한다(e.g., 80, 8080 - HTTP, 443 - HTTPS).  
	- 이 방화벽들은 패킷을 **깊이 있는 검사를 수행하지 않고**, **네트워크(IP)**와 **전송(포트)** 계층 정보만을 사용하여 필터링 결정을 한다.  
	- 고급 공격자는 여전히 **IP 주소와 포트를 위조**하고 **악성 페이로드를 숨기는** 등의 공격을 수행할 수 있다(e.g., SQL injection).  

- 응용 프로그램 방화벽은 패킷을 검사하고 다음과 같은 응용 프로그램 계층 수준의 공격으로부터 시스템을 보호한다.
	- SQL injection  
	- Cookie manipulation  
	- Cross-Site Scripting (XSS)
	- etc.


### Proxy Firewall

- **Proxy**  
	프록시는 종단 사용자와 그들이 브라우징하는 웹사이트를 분리하는 중간 서버이다.

![Figure 13](../assets/images/NetworkSecurity_13.png)

  
- **프록시 방화벽**은 네트워크/전송 계층과 응용 프로그램 계층(깊은 검사) 모두를 검사한다.
- HTTP, FTP, SMTP 등 **다양한 네트워크 프로토콜**을 지원한다.
- 클라이언트-프록시 및 프록시-서버 **두 가지 연결**을 설정한다.  
  
- 프록시 방화벽의 **장점**  
	- Deep Inspections (application level)  
	- User authentication  
	- Caching  
	- Various protocol support  
	- Session management  
  
- 프록시 방화벽의 **단점**
	- Performance issue (due to deep inspection)  
	- Complicated structure  
	- False positives  
	- Encrypted traffic  
	- High costs


### Proxy vs. VPN

- VPN(가상 사설 네트워크)은 프록시와 유사한 역할을 한다.
- VPN은 클라이언트와 서버 간에 암호화된 연결을 설정하여 트래픽을 이 보호된 터널을 통해 라우팅하여 안전하고 개인적인 통신을 보장한다.


### Proxy vs. VPN Comparison

- **Security**  
	- VPN은 일반적으로 프록시보다 더 견고한 보안을 제공한다.  
	- VPN은 전체 인터넷 연결을 암호화하여 중간자 공격과 데이터 도청을 방지하는 데 효과적이다.  
	- VPN은 사용자 개인 정보의 보호를 더 잘 제공한다(**no logs policy**).  
  
- **Reliability**  
	- 일반적으로 VPN 연결은 더 안정적이다.  
	- 프록시 연결은 때때로 문제가 발생할 수 있다.  
  
- **Speed**  
	- 프록시는 트래픽의 일부만 처리하기 때문에 일반적으로 VPN보다 더 빠를 수 있다.  
	- VPN은 트래픽을 더 잘 암호화하기 때문에 성능이 낮아질 수 있다.  
  
- **Usage**  
	- VPN은 데이터 보호가 중요한 비즈니스 환경이나 민감한 활동에 적합하다.  
	- 프록시는 IP 주소를 일시적으로 변경하거나 지역 제한을 우회하는 등의 가벼운 사용에 적합하다.
