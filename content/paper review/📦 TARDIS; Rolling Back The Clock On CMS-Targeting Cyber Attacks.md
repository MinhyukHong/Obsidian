---
review date: 2025-07-21
conference: IEEE S&P 2020
reading: true
done: true
summary: TARDIS는 CMS 생태계에서 사이버 공격을 식별하고 손상된 윈도우에 대해 수동 검증 대비 성능을 평가하기 위한 nightly 백업, snapshot, 공간 매트릭 기반 방법론이다.
---
*Reference:* [[📦 Mistrust Plugins You Must; A Large-Scale Study Of Malicious Plugins In WordPress Marketplaces]]

## Abstract

- 전세계 55% 이상의 웹사이트들이 CMS 상에서 실행되고, 이 거대한 CMS 기반 생태계는 해커들의 주요 타겟이 된다.
- 웹사이트 호스팅 산업의 대다수는 보안을 위해 "backup 및 restore" 모델로 전환했으며, 이는 오류가 발생하기 쉬운 AV(Anti-Virus) 스캐너에 의존하여 사용자에게 감염 전 nightly snapshot으로 롤백하도록 유도한다.
- 이 연구는 30만 개 이상의 웹사이트의 nightly backups에 대해 연구하고, CMS 기반 웹 사이트의 공격 환경을 측정하고 백업 및 복원 보호 체계의 효과를 평가했다.
- 수만 건의 공격 진화가 명확한 장기 다단계 공격 패턴을 보였다.
- 자동화된 출처 추론 기술인 TARDIS를 제안하며, 이는 웹 사이트 호스팅 기업이 이미 수집한 nightly backups 만을 기반으로 CMS 타겟팅 공격의 조사 및 개선을 가능케한다.
- 300K 웹 사이트의 nightly backups에 TARDIS를 적용했으며 6 일에서 1,694 일까지 지속 된 20,591 개의 공격을 발견했으며 그 중 일부는 아직 감지되지 않았습니다.
---


## 1. Introduction

- CMS 생태계에서는 WordPress가 60% 이상 점유하며, CMS를 타겟팅한 사이버 공격이 급격하게 증가하고 있다.
- 이러한 종류의 사이버 공격이 쉬운 이유는 CMS를 통한 배포는 계층 소프트웨어와 인터프리터의 혼합이기 때문에 인터넷을 향한 웹서버의 다양한 네트워크 및 시스템 권한을 갖는다.
- 이 연구는 불안정한 트렌드도 밝혀냈다: CMS를 통한 배포는 "낮고 느린" 다단계 공격을 압도적으로 나타낸다.
- 복잡한 소프트웨어 시스템의 상당 수의 배포에도 불구하고, CMS 타겟팅 사이버 공격을 분석하고 개선하기 위한 연구는 거의 수행되지 않았다.
- 전통적으로 연구 커뮤니티는 공격의 출처를 알아내기 위해 세분화된 logging으로 전환했지만, CMS 도메인에서 이러한 테크닉은 통하지 않는다.
- 기술의 발전에도 불구하고 세분화된 logging은 성능 및 공간 오버헤드가 발생하고 타겟 시스템으로의 training이 필요하며, 웹사이트는 사이트 owner가 아닌 hosting provider에 의해 컨트롤된다.
- 이러한 이유로 업계 표준에서는 오랫동안 인기있는 platform에서의 =="backup 및 restore" security model==로 전환해왔다; `Dropmysite`, `Codeguard`, `GoDaddy`, `Sucuri`, `iPage`.
	- 이러한 접근의 한계는 다음과 같다: 대부분의 잘 알려진 악성코드만 검출하고, 은밀한 다단계 공격을 탐지하지 못하고, 오탐율이 높은 실제 경보는 무시된다.
- 이 연구에서는 약 30만 개의 웹사이트에 대한 nightly backups 공격 트렌드를 연구할 수 있었다.
- CodeGuard와 협업하여서 비효율적인 restore 및 backups 표준을 대체할 수 있는 웹사이트 보호 방법론을 개발했다.
- 각 공격의 진화는 명확한 다단계 공격 패턴을 나타냈다.
- 이 공간에 대한 실질적 영향을 확인하기 위해 포렌식 기술이 CMS owner에게 광범위하게 사용가능한 유일한 산물로 집중하는 것을 제안한다: *nightly backups*.
- 결론적으로, 이 논문에서는 TARDIS를 소개한다: 다단계 CMS-targeting 공격을 조사하도록 하는 새로운 *provenance inference techinique(출처 추론 기술)*
- nightly backups 만으로, TARDIS는 공격 단계의 타임라인을 재구성하고, *compromise window*를 복구한다.
- 또한, snapshot을 신뢰해서는 안 될 시점도 밝혀낸다.
---


## 2. Preliminary Investigation

- **Key cyber forensic question**: 연구자들은 위에서 언급한 공격으로부터 웹 사이트를 어떻게 복구할 것인가?
- **Inferring Provenance Patterns:**
	- 모든 웹 사이트의 진화에는 유한 개의 동일한 출처 패턴이 존재한다.
	- 주어진 snapshot의 파일에는 3개 중 한 개 상태가 있다: `added`, `modified`, `deleted`
	- *Figure 1*에서는 세 가지의 감염 시나리오를 나타낸다.

![Figure 1](tardis_f01.png)

>[!note] Figure 1
>`A`에 추가된 파일은 AV에 의하여 '의심'스럽다고 flagged 처리될 수 있다(`!`로 표시됨). 또한, 이 파일들은 `M`으로 바뀐 뒤에도 의심스럽다고 flagged 처리될 수 있다.
>snapshot rollback은 파일을 삭제(`D`)함으로써 의심스러운 파일을 처리한 뒤에 수행되기도 한다.
>rollback이 모든 공격자의 파일을 삭제한다면, (a)과 같이 cured된다. 반면 의심스러운 파일을 탐지함에도 불구하고 아무런 조치가 취해지지 않는 경우도 있다(c).
>결론적으로, "backup 및 restore" 산업 표준이 비효율적이라는 것을 발견하게 된다.

- 웹 사이트의 80%가 여전히 감염되었고, 많은 웹 사이트 owner가 snapshot으로 rollback하고 취약점을 패치했지만, 포렌식 전문지식의 부재로 사전 감염 snapshot을 식별할 수 없었다(초기 백도어를 제자리에 두고 공격이 재발하도록 함).
- 연구자들은 clean snapshot으로 rollback하기 위하여 손상된 window를 복구하거나, snapshot을 신뢰할 수 없었던 기간 만큼을 복구해야 한다.
	- 이는 각 snapshot이 수만 개의 파일을 포함하고 있기 때문에 작업을 더 복잡하게 한다(avg 11,292개).
	- *A search for needles in a haystack*
	- 따라서 단일 Drupal 웹사이트인 W682886로부터 개별 snapshot으로 drill down했다.

- **Single Snapshot Metrics:**
	- W682886으로부터 개별 snapshot을 통해, 두번째 key observation을 정립했다: 각 snapshot의 complexity는 사이버 공격의 증거를 강조할 수 있는 *spatial metrics*라 불리는 일련의 측정 세트로 줄일 수 있다.
	- 1st spatial metric: 이전 snapshot에 있는 각 파일의 상태
	- 2nd spatial metric: 파일 간의 익스텐션 mismatch를 측정(e.g., 파일 내부의 형식이 파일 이름의 확장자와 일치하는 경우)
	- 3rd spatial metric: 서버-사이드 스크립트 파일에서 UTF-8 기반 코드 난독화를 식별(e.g., 2018년 6월 5일 공격이 시작된 snapshot으로부터 W682886에서 3개의 위장된 난독화된 페이로드 PHP 파일을 발견)
	- + 9 spatial metrics: 단일 snapshot에서 사이버 공격 표면의 존재를 색출하는 데에 효율적

- **Temporal Evolution Of Attack Phases:**
	- 연속적인 snapshot 쌍 사이의 갑작스러운 변화에 주의를 기울이며 W682886의 각 snapshot을 나타내기 위해 spatial metrics를 모았다.
	- Third key observation: 이러한 갑작스러운 변화가 공격 단계를 노출할 수 있도록 trigger하는 내포된 이벤트 모델링; 이를 통해 W682886 snapshot에서 spatial metrics의 시간적인 진행을 표시할 수 있었다.

![Table 1](tardis_t01.png)

- Table 1은 단일 spatial metric, 즉 파일 포멧 숫자만을 고려하여 이러한 진행 상황 중 하나를 보여준다.
- 이 메트릭의 시간에 따른 진화는 첫번째 공격 징후를 노출시켰다.
- Table 1: 파일 포멧 메트릭의 갑작스러운 변화는 4/21, 6/5-8, 6/13-14에 두드러진다.
- 이상치 발견: 2018/4/14 - 5/21에 3개의 Drupal 웹 사이트에서 동일한 spatial metric 이상치를 발견했고, 이를 통해 공격의 측면 이동을 시사한다.
- 웹 공격은 대규모의 파일을 웹서버에 떨어뜨리는 것이다. 이 패턴은 동일하게 진화되어 왔다; 기존 악성코드에 기능을 추가
	- 또한, 이러한 공격은 대부분의 공격 파일을 삭제하면서 그들의 흔적을 지운다.

- **Attack Model:**
	- 위와 같은 패턴은 다단계 공격 모델을 기반으로 구성되어 있다.
	- 공격 패턴과 특성은 다음과 같다:
		- slow and steady
		- initial foothold
		- malware injection
		- maintaining persistence
		- lateral movement
		- clean up traces of malicious activity
	- ==TARDIS==
		- 공격 증거의 출처 추론
		- 진화가 밝혀낸 손상된 window와 공격 단계의 진전에서의 이상치 식별
		- 결론적으로, TARDIS를 통하여 포렌식 연구자는 초점을 두어야 할 부분을 알 수 있고, 웹 사이트 owner는 웹 사이트를 빠르게 clean snapshot으로 복구할 수 있다.
---


## 3. Design

![Figure 2](tardis_f02.png)

- TARDIS는 CMS 배포의 nightly backup만을 가지고 출처를 추론하는 테크닉의 한계점을 극복한다.
- Fig.2
	1. TARDIS는 각 snapshot으로부터 일시적으로 정렬된 공간 요소 세트를 구성한다.
	2. 각 개별적인 snapshot의 요소에 대한 spatial metrics를 계산한다.
	3. 일시적으로 수집된 spatial metrics를 상관시키고, 공격 모델에 대해 쿼리하여서 타임라인 및 레이블 공격 이벤트를 복구한다.
	4. 할당된 공격 라벨 순서를 증명하고 손상된 window를 추출한다.
---

### A. Spatial Element Sequencing

- TARDIS는 각 night's snapshot과 관련된 파일을 추출하고 각 snapshot에 공간 요소들로 매핑한다.

> Example
- W682886의 초기 snapshot($\psi_0$)은 11,327 파일을 포함한다.
- 이러한 모든 파일은 $V_0$의 공간 요소의 sequence로 매핑된다.
- 단일 spatial metric 예시에서, 이 snapshot은 23개의 서로 다른 파일 종류를 포함한다 (e.g., PHP, HTML, JS, CSS, etc.).
- 이 정보는 spatial metric 세트 $M_0$에 기록된다.
- 백업들이 3달 동안의 nightly 기반으로 수집되었다면(e.g., 91 backups):
	- $V=[V_0, V_1, ..., V_{90}]$
	- $M=[M_0, M_1, ..., M_{90}]$
	- $V_0=[el_0, el_1, ..., el_{11326}]$
	- $M_0=[num(PHP)=727, num(CSS)=829, ...]$
---

### B. Spatial Analysis

- 공간 요소 세트는 다양한 파일 종류(PHP, HTML, JS, CSS, images, plaintext, etc.)로 구성되며, 각 공격 속석을 식별하기 위해 서로 다른 분석 테크닉이 필요하다.
	- 이 도전을 해결하기 위해 두 종류의 메트릭을 추출하기 위해 공간 분석을 분리한다: ==(1) 구조 메트릭(structural metrics), (2) 코드 메트릭(code metrics)==.

*Structural Metrics:*
**Hidden Files and Directories.**
- 장기적인 다단계 공격은 기존의 셋업을 수정하고 동시에 취약하게 만드려는 공격자의 의도로 특정지어질 수 있다.
- 이는 preliminary study에서, 1차 탐지를 우회하기 위해 숨겨진 파일로서 악성/의심되는 element들을 dropping하거나 숨김 디렉토리에 배치하며 이루어진다고 관찰하였다.
- TARDIS는 일반적으로 예상되는 숨김 요소들을 필터링하여 패턴 매칭을 사용하고(`.htaccess`) 숨겨진 위치에서 $el_j \in V_i$ 요소를 찾을 때 structural metric $Hide(el_j(\psi_i))$이 $M_i$에 추가된다.

**Extension Mismatch**
- 공간 요소들은 기만하며 icon file(e.g., `favicon.ico`)로 이름이 바뀌지만, 이는 기술적인 지식이 부족한 CMS 사용자들로부터 회피하기 위해 PHP 코드를 포함한다.
- TARDIS는 익스텐션을 추출하고 추론된 파일 포멧에 매칭하기 위해 공간 요소들의 파일 이름을 사용한다 (e.g., via the file type's magic number or other formatting that can identify the type of file).
- TARDIS가 파일 유형과 $el_j \in V_i$의 익스텐션을 매칭하며 불일치를 찾아낸다면, structural metric $ExtMis(el_j(\psi_i))$에 $M_i$를 추가한다

**Filename Entropy**
- CMS-targeting 공격의 또 다른 의심스러운 행동의 지표: 길고 일관성이 없거나(incoherent) 무작위로 생성된 파일이름.
- TARDIS는 모든 공간 요소 $el_j$에 대한 파일 이름의 엔트로피를 측정한다.
- *높은 엔트로피일수록 사람이 만들어낸 양성과 파일이름과는 거리가 있는 랜덤한 지표이다.*
	- 엔트로피는 비밀번호 강도 계산 로직으로 측정된다.
- 일시적 snapshot $\psi_i$로부터 $el_j \in V_i$에 대해 비교적 높은 엔트로피가 식별될 때 structural metric $HEntrp(el_j(\psi_i))$는 $M_i$에 추가된다.

**Permission Change**
- TARDIS는 snapshot의 권한 변화를 탐지하기 위해 각 공간 요소를 tracking한다.
- e.g., non-executable(read-only, read-write, etc.)에서 executable로 변화했을 때, 의심을 발생시킨다; 개발자가 non-executable에서 실행 권한을 제공하는 것은 드문 일이기 때문이다.
- 이 연구에서 관찰된 것은, 다단계 공격이 텍스트 파일 내의 패키지 쉘 스크립트를 공격한 뒤 파일 권한을 변경하여 권한 상승의 기회를 노린다는 것이다.
- 권한 변경 실행 가능성을 갖춘 일시적인 snapshot $\psi_i$로부터 $el_j \in V_i$를 식별하면, TARDIS는 $Exec(el_j(\psi_i))$를 $M_i$에 추가한다.

![Table 2](tardis_t02.png)

![Figure 3](tardis_f03.png)

**Script Directive Outlier Analysis**
- 공간 요소에 예외적으로 길과 복잡한 모호한 코드를 주입하는 것이 공격 행동을 식별할 수 있는 강력한 힌트임을 발견했다.
	- 공격자들은 주입된 코드의 가독성을 제한하기 위해 이러한 기법을 사용하고, 이는 즉각적인 reverse engineering 또한 delay 시킨다.
- Fig.3에서는 서버 사이드 코드를 포함한 모든 공간 요소들에서 directive length distribution의 2018.05.02 W682886의 snapshot을 보여준다.
	- x축: 공간 요소 인덱스 $j$
	- y축: 각 코드 파일에서 가장 긴 directive length
- 공간 요소 내에서의 긴 directives가 의심스러움을 발견했지만, 이 길이에 대한 임계값을 결정하는 것은 개발자들 별로 각기 다른 코딩 스타일로 인해 어려움을 겪는다.
- 하지만, 의심스러운 공간 요소는 일시적 snapshot과 이상치 분석을 통해 결정할 수 있기 때문에, 의심스러운 파일(긴 directives를 가진)을 MAD(median absolute deviation)을 통해 평가한다.
- snapshot $\psi_i$로부터 의심스러운 긴 directive lines 공간 요소 $el_j \in V_i$를 발견한다면 TARDIS는 코드 메트릭 $LongLine(el_j(\psi_i))$를 공간 메트릭 세트 $M_i$에 추가한다.

**Obfuscation Detection**
- 서버 사이드 악성코드는 UTF-8이나 8-bit 문자를 포함한 문자열을 사용한다는 것을 발견했다.
	- 이러한 문자열 구성 자체는 악성이 아니지만, 악의적인 문자열과 코드 스니펫을 찾는 탐지기를 피하는 기법이다.
- 배열 맵 난독화는 방어를 피하기 위한 또다른 난독화 방식이다.
	- 배열 맵은 각 문자를 다른 문자로 매핑하도록 정의된다.
	- 이 맵은 뒤섞인 문자 리스트로 보이는 것을 난독화 해제하는 데에 사용되어 reverse 엔지니어가 이 난독화된 공간 요소에 대해 이해할 수 있도록 한다.
	- Example: `lnhqvwxeaon()`은 뒤섞인 문자열을 받는 함수(변수 `$zvkgw`에서)이고, `$lyfuf`에서 배열 맵을 사용하여 PHP `eval`함수로 실행되는 악성코드를 생성한다.

```
$lyfuf = Array(’1’=>’G’, ’0’=>’6’, ’3’=>’4’, ’2’=>’L’, ’5’=>’1’, ’4’=>’W’, ’7’=>’y’, ... , ’y’=>’w’, ’x’=>’F’, ’z’=>’l’); eval(lnhqvwxeon($zvkgw,$lyfuf));
```

- 위에서 언급한 것과 정규식 패턴 매칭을 통해 temporal snapshot $\psi_i$로부터 요소 $el_j \in V_i$ 에서 난독화의 spatial detection이 일어나면,
	- TARDIS는 코드 매트릭 $Obfus(el_j(\psi_i))$을 $M_i$에 추가하여 $el_j$에서 난독화가 있음을 나타낸다.

**Suspicious Payload Evaluation**
- 서버 사이드 공간 요소에서, `eval`, `base64_decode`, `url_decode`는 주로 이전에 식별된 난독화된 코드를 실행하도록 쌍을 이룬다.
- TARDIS는 각 컨트롤 플로우에서의 패턴 매칭을 통해 `eval`과 `base64_decode/url_decode` 쌍의 인스턴스를 식별하고 flag 처리한다.
- 이러한 코드 unwrapping 기술로 temporal snapshot $\psi_i$로부터 $el_j \in V_i$에서 식별 시,TARDIS는 코드 매트릭 $EvDc(el_j(\psi_i))$를 $M_i$에 추가하여 기존 탐지를 피하기 위해 압축된 안전하지 않거나 의심스러운 코드를 나타낸다.

**Code Generation Capability**
- 다단계 CMS 타겟팅 공격 에 사용되는 거의 모든 서버 사이드 공간 요소들은 `create_function`과 같은 기능 사용으로 코드를 생성할 수 있다.
	- 이는 서버 사이드 코드 개발에는 거의 사용되지 않는다.
- TARDIS는 이러한 코드 생성 기능에 대해 검사하고, 제약조건을 충족하는 $el_j \in V_i$을 찾을 때 코드 매트릭 $CodeGen(el_j(\psi_i))$을 공간 매트릭 세트 $M_i$에 추가한다.
---

### C. Temporal Correlation and Forensic Recovery

![Table 3](tardis_t03.png)

- 각 snapshot에 대해 수집된 공간 매트릭에 기반하여, TARDIS는 매트릭들을 snapshot들과 시간적으로 연관지어 웹 사이트 내에서 발생하는 의심스러운 행동을 식별한다.
- TARDIS는 슬라이딩 n-day 윈도우를 통해 개발 타임라인을 추적하도록 설계되었다.
- TARDIS는 슬라이딩 윈도우($i-n < x \le i$) 내의 모든 이전 snapshot의 공간 매트릭 $M_x$와 임의의 시간적 snapshot $\psi_i$에서 공간 매트릭 세트 $M_i$를 시간적으로 연결시킨다.
	- 이를 통해 지속적인 적대 관계를 포착하고, 이벤트 타임라인을 추출한다.
- 매트릭 $M$에 존재하는 패턴은 공간 요소의 함수로 할당되고, 이는 탐지될 수 있는 장기간(long-lived)의 다단계(multi-stage) 공격 행동을 나타낸다.
- 연구에서는 이러한 행동을 암호화하기 위한 공간 매트릭의 Boolean 기반 룰을 구축했다.
	- 이 룰은 개별 매트릭에 적응하도록 설계되었고 장기 다단계 공격이 겪는 단계의 불변량을 기반으로 한다.
-  ==Table 3==은 현재 구현의 일부로서 적용된 대표 룰을 보여준다.
	- 공간 매트릭에 있는 패턴을 캡슐화하는 이벤트의 시간적 상관관계는 한 번에 두 개의 연속적인 시간적 snapshot을 고려하여 구현되었다.
	- 2-tuple <$M_{i-1}, M_i$>은 Table 3의 공격 모델에 쿼리된 TARDIS의 시간적 상관관계 단계로 전달된다.
	- 공격 라벨 세트 $L_i$ 및 심각도는 각 시간적 snapshot에 할당되어 공격 타임라인을 점진적으로 구축한다.
	- 공격 라벨의 할당된 심각도는 다른 요소보다 해당 라벨이 critical 하다는 점을 연구자들에게 시사한다.
- Table 3에 제시된 룰은 우리의 통찰력 뒤에 있는 전반적인 직관을 포착한다.
	- Example. W682886은 두 가지의 난독화 코드 주입 사례를 갖는다:
		1. 기존의 난독화되지 않은 요소에 의심되는 난독화 코드가 주입되는 경우
		2. 이미 난독화된 요소에 추가적인 난독화 코드가 추가되는 경우
		- 위의 관찰에 대한 연구 프로세스:
			1. 난독화된 공간 요소 $el_j(\psi_i) \in V_i$ 크기가 증가하는 경우 (*i.e. 난독화 공격 진행*), 스크립트 지시문 이상치가 $el_j(\psi_{i-1})$가 아닌 $el_j(\psi_i)$에서 flag 될 경우 (*i.e. 난독화 코드가 기본의 난독화되지 않은 요소에 주입*), 코드 매트릭 $Obfus(el_j(\psi_i)) \in M_i$의 경우
			2. 공격 라벨 "Obfuscated Code Injection"이 snapshot $\psi_i$의 $L_i$ 세트에 추가된다.
---

### D. Compromise Window Recovery

![Algorithm 1](tardis_a01.png)
- 공간 요소, 매트릭, 할당된 공격 라벨 (i.e. <$V, M, L$>$_i$)의 연속적인 3-tuple 쌍의 파싱을 통해 TARDIS는 손상된 윈도우를 추출한다.
- Algorithm 1의 8-16번째 라인을 참고하면, 속상 값 빈도(AVF)를 계산하는 것을 확인할 수 있다.
	- 차등 공간 매트릭 $DiffAttr_i$ 에서 AVF 알고리즘을 사용하고, 의심스러운 활동 순서대로 시간 snapshot $\psi_i$에 rank하기 프로세싱한다.
- TARDIS가 전체 시간적 순서에 대한 최종 공격 라벨을 출력하기 전에, 라벨 세트 $L$을 관련 라벨(Lines 4-6 in Algorithm 1)의 *logical sequence verification*으로 넘긴 뒤에 그 순서를 평가한다.
- TARDIS의 손상 윈도우는 8개의 라벨 중 2개에 의해서만 영향을 받는다; *attack cleanup, maintain presence*
- TARDIS는 손상 윈도우의 시작점으로서 다른 라벨의 모든 조합을 고려한다. 이는 혼란을 야기하기 위한 out-of-order 페이로드 배포를 시도할 수도 있는 공격자들에게 TARDIS가 더욱 견고할 수 있도록 한다.
---


## 4. Validating our Intuition

- 연구가 시사하는 CMS-타겟팅 공격의 특징은 =="low and slow"와 다단계 공격==이다.
	- 이에 기반하여, 손상된 윈도우를 복구하고 공격 타임라인을 재구축하기 위해 TARDIS를 설계했다.
	- 이를 평가하기 위해 ground truth와 함께 마이크로벤치마크를 수행한다.

![Table 4](tardis_t04.png)

![Table 5](tardis_t05.png)

---

### A. Identification of Attack Models

- TARDIS의 공격 타임라인 재구축 능력을 평가하기 위해 각 웹사이트의 백업 시퀀스를 실행하며, 각 nightly snapshot에 어떤 공격 라벨이 할당되는지 기록했다.
	- *TARDIS는 웹사이트 백업 조사를 위한 ground truth 접근 권한이 없으며, 오직 타임라인 추출을 위한 공간 매트릭과 공격 모델의 시간 상관에만 의존한다.*
- 다음 단계로, 수동적으로 도출한 ground truth와 TARDIS로부터 나온 공격 라벨을 비교한다.
- Table 5에서, TARDIS의 공격 모델은 손상된 웹사이트 내부에서 공격 라벨을 *높은 정확성*으로 탐지한다.
	- 권한 상승과 establish foothold 공격에서 FP로 식별된 라벨은 0개이다.
	- 난독화 코드 주입 (FP: 1개), 연결 유지(maintain presence) (FP: 1개), 악성코드 드롭 (FP: 3개), attack cleanup ((FP: 4개)) 라벨에서도 TARDIS의 높은 탐지율을 보여준다.
- 또 다른 발견은 공격 기법이 CMS 플랫폼마다 크게 다름에도 불구하고, 몇몇 라벨은 모든 공격에서 나타난다는 것이다.
	- 특히 연결 유지, 악성코드 드롭, 방어 회피(defense evasion) 라벨은 모든 손상된 CMS에서 나타난다.
	- 이들은 매우 직관적으로 보이지만, 연구의 예상을 검증해준다; *CMS 타겟팅 공격은 압도적으로 장기적이고 다단계 공격 행동을 보인다.*
---

### B. Multi-Stage Attack Timeline

- TARDIS는 다단계 공격에 감염된 83개의 웹사이트를 발견해냈다.
	- 흥미롭게도 50% 이상의 공격들이 WordPress를 타겟으로 하고 있었다.
- 수동 검증을 통해서는 TARDIS가 놓친 공격을 포함하는 어떠한 웹사이트도 발견하지 못했다; ==0 FN==
- TARDIS가 도출한 결과에는 3개의 FP가 존재한다; i.e. Table 4의 4번 컬럼(WordPress, Drupal, TYPO3)
- 수동 검증을 통해 난독화 코드가 있는 user-developed 보안 플러그인을 포함한 웹사이트 3개를 발견했다. 이는 TARDIS가 손상된 윈도우에 대해 도출하는 일반 공격자들의 기법과 유사하다.
- Sucuri, Wordfence 등 몇몇 공개적으로 사용 가능한 보안 플러그인이 있었지만, TARDIS는 라이센스 정보가 포함된 CMS 보안 플러그인에 속하는지 확인하는 절차를 통해 잘 알려진 양성(benign) 난독화 케이스만을 다룰 수 있다.
---


## 5. Deploying TARDIS In The Wild

![Table 6](tardis_t06.png)

- TARDIS를 통한 분석이 CMS 기반 웹사이트 백업을 정확하게 포착한다는 것을 검증한 뒤, TARDIS를 데이터셋의 특정 비율에 적용하기 위해 CodeGuard를 함께 사용했다.
	- 연구에서는 306,830개의 웹사이트의 nightly 백업이 실제 상황에서CMS 기반 웹사이트의 상태를 실증적으로 측정하기 위해 이러한 접근 방식을 활용했다.
- **Experimental Setup**
	- AWS의 EC2 r5.2xlarge 인스턴스(8 가상 CPU, 64GM RAM)를 사용
	- AWS Batch job 스케줄링 엔진으로 총괄된다; 이로써 TARDIS는 ==병렬적으로== 수백만 개의 웹사이트 백업을 실행할 수 있다.
	- 연구를 서포트하기 위한 몇 가지 툴도 사용한다:
		- WhatCMS, CMS Garden (CMS 분류기)
		- TARDIS는 파이썬으로 작성 (2500 라인 코드)
		- 주입된 요소 이름에서의 엔트로피 예측을 위한 zxcvbn
		- 데이터 분석을 위한 Pandas 라이브러리
---

### A. The CMS Landscape

- Table 6
	- 컬럼 2에서 보이는 것처럼, 대다수의 웹사이트는 WordPress를 사용한다.
	- 데이터셋에서 전체 웹사이트의 96%가 WordPress를 사용한다.
	- 이는 CodeGuard의 프로덕션 세트 내 WordPress 사용자들의 높은 마켓 공유 특성 때문이다.
	- 컬럼 2에서, Contao를 제외하고는 데이터셋의 모든 CMS는 다단계 공격의 희생자이다.
	- 전체적으로, 연구에서는 20,591개의 손상된 웹사이트를 발견했다.
		- 이러한 공격에 의해 감염된 WordPress 웹사이트는 19,260개이다 (전체 WordPress 웹사이트의 6.5%).
	- 컬럼 4에서는, 대부분의 CMS가 평균적으로 수만 개의 파일을 포함한다는 것을 보여준다.
	- 하이라이트 처리된 부분에서는, 대부분의 손상된 웹사이트가 50% 혹은 그 이상 증가된 파일을 보여준다.
	- 파일 수의 가장 높은 팽창은 TYPO3 CMS에서 보여준다(손상 시 평균의 150% 증가).
		- WordPress는 80%로 두번째를 기록했다.
---

### B. Evolution of Attacks

![Table 7](tardis_t07.png)

---

### C. Compromise Window

![Figure 4](tardis_f04.png)

![Table 8](tardis_t08.png)

---

### D. Existing Attack Mitigation Framework

(생략)

---

### E. Perfomance

![Figure 5](tardis_f05.png)

- Figure 5: 파일 개수의 측면에서 웹사이트의 사이즈 대비 306,830개의 웹사이트에 대한 모든 속상을 측정하기 위한 TARDIS를 통해 관찰된 시간.
- TARDIS는 각 시간 snapshot을 선형적으로 평가하며 *허용 가능한 오버헤드를 가지고* 전체 웹사이트에 대한 이벤트의 타임라인과 이벤트 라벨을 제공한다.
	- 이 오버헤드는 웹사이트의 파일 개수에 따라 확장되지만(파일 사이즈에 상관 없이), Figure 5의 점진적인 기울기에서 볼 수 있듯이 증가는 최소화된다.
- TARDIS의 worst-case: 1859개의 snapshot을 처리하는 데에 3500초의 최대 시간이 소요되었다(평균 100,000 개의 공간 요소).
	- 오프라인 포렌식 기술로서, 연구에서는 이 케이스가 합리적이라 평가한다.
---


## Discussion

- 사이버 공격을 카테고리화 하는 데에 있어서 분류 기준이 명확한가?
- TARDIS의 사이버 공격 식별 성능은 뛰어난가?
- nightly snapshot 추출을 통한 공간 매트릭과 요소 매핑이 분석에 용이한가?
- TARDIS가 사이버 공격을 탐지하기 위해 사용하는 주요 테크닉은 합리적인가?