---
reporting date: 2024-09-24
reading: true
done: true
summary: 안드로이드 모바일 앱에서 요청하는 권한은 앱 카테고리 별로 특정되어 있고 위험한 권한을 선언하는 앱이 대다수이기 때문에, 권한을 제대로 인지하여 앱을 사용해야 한다.
---
## Reference
---
[cybernews](https://cybernews.com/security/popular-android-apps-ask-for-too-many-dangerous-permissions/)


## Abstract
---
![Figure 1](how_many_permissions_01.png)

- 모바일 앱의 권한 남용 문제를 시사한다.
- 모바일 앱 상에서 요구하는 지나치게 광범위한 permisson은 하나만으로도 데이터 노출로 이어질 수 있지만, 대부분의 앱들은 단일 permission에서 멈추지 않는다.
- 유명한 안드로이드 앱에서는 사용자의 위치, 파일, 카메라로는 그 permission이 충분하지 않다.
- Cybernews 연구팀이 밝혀낸 결과에 따르면 안드로이드 앱들은 평균적으로 11개의 위험한 permission을 사용한다고 한다.


## Methodology
---
- 연구에는 Google Play 스토어의 top 50개 인기 앱을 선정하고, 그들이 어떠한 위험한 permission들을 요청하는지 살펴보기 위해 ==Manifest 파일을 분석==했다.
	- 모든 안드로이드 앱에 포함된 Manifest는 앱이 access 할 범위를 디바이스에 알려주는 rule book이다.
	- 최종적으로, 사용자의 개인정보나 모바일의 주된 기능에 영향을 미칠 수 있는 "위험한" permission은 41개가 있었다.
- 위험한 permissions들은 앱이 시스템과 민감한 사용자 데이터에 크게 영향을 미칠 수 있는 제한된 데이터에 접근하거나 작업을 수행할 수 있도록 한다.
- 이들 모두가 일반적으로 사용되는 것은 아니며, 일부는 겹치지 않는다.
	- 예를 들어, 앱이 "fine location"을 tracking한다면, "coarse location"은 필요하지 않을 수 있다.
	- 음성 메일 추가와 같은 몇 가지 niche feature들은 top 앱에서는 요구되지 않는다.
- 가장 좋은 방법은 개발자들이 최소한의 권한, 즉 앱이 주어진 특정 작업만을 완료하도록 permission을 선언하는 것이다.


## Which apps ask for the most dangerous permissions?
---
> **일반 앱**

- **MyJio**: 모든 Jio 앱은 인도의 인기 있는 디지털 서비스/텔레콥 제공 기업에서 개발되었다.
	- 이는 다양한 서비스: 결제, 클라우드 저장소, TV 스트리밍 등의 기능을 제공한다.
	- 앱은 거의 모든 permissions을 요구하는데; 위치, activity recognition, 라디오, 카메라, 마이크, 캘린더, 파일 접근 등.
	- 총 29개의 permission을 요구하며 리스트 상 1위를 차지한다.
- **Meta**의 인기 있는 메신저, 비디오 콜 앱인 **WhatsApp**은 26개의 permissions를 요청하며 2위를 차지했다.
- 많은 안드로이드 폰은 Truecaller를 포함한다: Caller ID & Block - 발신자 확인 및 스팸 전화 차단 앱
	- 24개의 위험 permissions를 요청
- Google Messages, WhatsApp Business - 23개의 위험 permissions 요청
- SNS: Facebook - 22, Intagram - 19 위험 permissions 요청

> **게임**


- Among Us는 위험 permission을 하나도 요청하지 않았다 (*zero dangerous permissions*).
- Candy Crush Saga, 8 Ball Pool 등 인기 게임 앱 - 1~2 위험 permissions 요청 (대부분은 알림 push를 위한 permission)
- ==적은 수의 권한 요청은 앱이 안전하다는 것을 의미하지는 않는다.==

![Figure 2](how_many_permissions_02.png)


## The most requested permissions
---
- 분석된 거의 모든 앱(47개)은 게시물 알림(==post notifications==)을 위한 permission을 사용자에게 요청한다.
	- 이 권한들은 처음 봤을 때 무해(innocuous)해 보이지만, 다양한 방법으로 부당하게 이용될(exploited) 수 있다.
- 악성 앱에 의해 도용되는 가장 빈번한 알림은 원치 않는 광고, 피싱 링크, 잘못된 정보를 사용자에게 퍼붓는 것이다.
- 이 시스템의 구현으로, 상업 스파이웨어 공급 업체로부터 사용자를 추적하기 위해 알림 서비스가 도용되는 사례도 있었다. - Mantas Kasiliauskis
- 2023년 미국 상원의원 Ron Wyden은 경고했다. [letter](https://s3.documentcloud.org/documents/24191267/wyden_smartphone_push_notification_surveillance_letter_to_doj_-_signed.pdf)
	- 알림은 앱에서 스마트폰으로 직접 이동하지 않고도 민감한 데이터를 포함할 수 있으므로 정부 원격 감시를 촉진
- 알림은 중개를 통과한다. - *digital post office*
	- 이는 안드로이드 폰에서, Google's Firebase Cloud Messaging 이 대표적이다.
- 두 번째로 가장 많이 요청된 permission은 앱 바깥 ==디렉토리의 저장소에 접근==하기 위한 것이다.
	- 전체적으로 40개의 앱이 file write, 34개의 앱이 file read permission을 외부 저장소로부터 요청하고 있었다.
	- 이는 사용자가 디바이스에 저장해 놓은 ID(신분증) 사진에 접근할 수 있다는 것이다.
- Kasiliauskis said:
	- 이 permissions는 사용자가 프로필에 미디어를 업로드하거나 SNS에서 스토리를 공유 혹은 사진이나 비디오를 저장하는 데에 있어 필수적이다.
	- 이 권한들을 제외하고는 Instagram은 사진에 접근할 수 없고, 메시지 앱은 문서를 저장할 수 없으며 사진 편집 앱은 작업 결과물을 저장할 수 없다.
	- 하지만, 이러한 permissions는 high-risk 로 분류된다. 앱은 사용자 데이터에 대한 접근이 필요한 이유를 확실하게 명시해야 한다.
- 악의적인 행위자들은 파일을 유출하거나(exfiltrate) 손상시키기 위해 저장소 접근 권한을 남용한다; 사진, 비디오, 문서, 그 외 개인정보
- ==카메라 접근이나 오디오 기록==은 그 다음으로 많이 요청되는 permissions으로, 33개의 앱이 요청한다.
	- 카메라 접근은 일부 앱에 기능적으로 필수적이며, 화면 캡처와 사진 공유를 허용한다.
	- 오디오 기록은 보이스 메시지와 다른 기능을 제공하기 위해 요청된다.
	- 이 또한 악의적인 행위자들에 의해 남용될 수 있고, 심지어 광고 회사들은 광고를 더 잘 타겟팅하려 한다.
- ==Get accounts== permission은 27개의 앱으로부터 요청되고 있었다.
	- 이는 Google 및 계정 동기화로 로그인 프로세스를 간결하게 한다.
	- 하지만 악의적인 행위자들은 과거에 계정을 하이잭킹하기 위해 소셜 로그인 기능을 남용했다.
- ==fine(precise) location==을 트랙킹하기 위해 26개 이상의 앱이 permission을 요청한다.
	- 몇 미터 이내의 사용자의 위치를 정확히 찾아낼 수 있다(pinpoint).
- 26개 이상의 앱이 ==read contacts== permission 요청
- Kasiliauskis said:
	- 많은 앱들이 사용자 맞춤화된 광고를 제공하기 위해 위치 데이터를 사용한다.
	- reading contacts 또한 민감한 개인정보(전화번호, 이메일, 이름)를 포함하기 때문에마찬가지이다.
- 22개의 앱은 ==Bluetooth connect== 를 요청한다.
	- 앱이 디바이스와 페어링하고 잠재적으로 데이터를 교환할 수 있다는 의미이다.
	- 이 permission은 헤드폰, 피트니스 트랙커, 스마트 가전 기기들과 연동하기 위해 필요하다.
- 22개의 앱은 ==phone state== 를 요청한다.
	- 모바일의 상태와 네트워크 통신(전화 번호, 현재 모바일 네트워크 정보, 진행 중인 전화, 디바이스 고유 ID)에 대한 중요한 정보를 승인한다.
- 신체 센서 접근이나 음성 사서함을 추가하는 permission은 어떤 앱도 요청하지 않았다.

![Figure 3](how_many_permissions_03.png)


## Communication and social apps are most hungry for data
---
- 분석된 50개의 앱 중 9개는 communication, 5개는 social networks 카테고리이다.
	- 이 카테고리는 데이터를 많이 요구하는(*data-hungry*) 카테고리이다.
- 커뮤니케이션 앱은 평균적으로 19개의 가까운 permissions를, 소셜 앱은 평균 17.2개의 위험한 permissions를 요청했다.
- 모든 커뮤니케이션 앱은 카메라와 파일에 접근한다. - record audio, track location data, read contacts & phone state, get accounts

![Figure 4](how_many_permissions_04.png)

![Figure 5](how_many_permissions_05.png)


## Games ask for fewer permissions, but are they all truly necessary?
---
- 19개의 게임 앱은 평균적으로 4개의 위험 permissions을 요청
- 하지만 그들 사이의 불일치는 상당하다; 일부는 12개, 또 다른 일부는 0개의 permission을 요청
- 대부분의 게임(16개)은 post notification을, 10개는 외부 저장소에 대한 data write, 9개는 read data를 요청
- 8개의 게임은 오디오 기록, 7개는 카메라 접근 permission을 요청
- 일부 게임은 write to the calendar (3), read phone state (3), fine location 데이터 permission을 요청
- Mobile Legends: Bang Bang (12), PubG Mobile (11), My Talking Angela (7) 는 가장 데이터를 많이 필요로 하는 (data-hungry) 게임 앱이다.

![Figure 6](how_many_permissions_06.png)


## How many permissions does a shopping app require?
---
- 쇼핑 앱은 평균적으로 13.4개의 위험한 permissions를 요청
- Lazada: AliExpress: 16-17 permissions
- Wish: 7 permissions
- 모든 앱은 camera, fine location, post notifications, read/write to storage 요청
- 일부만 Bluetooth access, record audio, read phone statements, calendars, contacts 요청

![Figure 7](how_many_permissions_07.png)

- Least data-hungry:
	- Netflix - post notifications, access storage, record audio, connect to Bluetooth
	- Zedge(wall papers & ringtones) - 4 dangerous permissions, fine location을 포함

![Figure 8](how_many_permissions_08.png)


## Even with zero dangerous permissions, an app can still be dangerous
---
- 안전한 양의 permission 이란 없다.
- 앱은 디바이스에 설치됨으로써 non-dangerous permissions를 얻는다.
- 앱은 startup에서 실행되고, background에 머물며 전체 network 및 민감 정보에 액세스 할 수 있다. [and more](https://cybernews.com/security/tried-revoke-all-android-app-permissions-impossible/)
- *Crucial things:*
	- 불필요한 앱을 정기적으로 삭제
	- 디바이스 설정에서 과도한 개인 정보 침해 권한 철회
	- 웹 브라우저에서 동일한 서비스에 액세스
- 위험한 permissions을 가진 너무 많은 앱들이 잠재적인 개인 정보 위험, 데이터 노출, 금융 위협을 하기 위한 *잠재적인 표면을 증가시킨다*.
- 많은 앱을 가지고 있으면, 즉각적인 문제가 발생하지 않더라도 배터리 소모가 빠를 뿐만 아니라 디바이스 성능에 부정적인 영향을 준다.
- 모바일을 건강하게 유지하기 위해, 신뢰할 수 있는 출처에서 앱을 받아야 한다.
	- third-party app 스토어나 sideloaded 앱을 정확히 인지하며 소프트웨어를 업데이터하고 필수 데이터를 백업한다.


## Discussion
---
- 우리가 사용하는 모바일 앱에 불필요한 권한이 있다면, 권한 허용을 철회할 수 있을까?
- 안드로이드 뿐만 아니라 iOS에서도 비슷한 권한으로 앱이 동작할까?