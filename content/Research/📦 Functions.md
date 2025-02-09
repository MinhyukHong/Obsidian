
Chrome Web Store에 등록되어 있어서 user에게 악성 행위를 할 가능성이 있는 익스텐션들을 정적 분석할 때 고려해야 할 점은 다음과 같다.

- 익스텐션이 웹 화면에서 어디서부터 어디까지 접근이 가능한가?
	- 익스텐션 JS 함수 중, 웹의 내용을 얻어오는 함수를 리스팅한다.
	- 웹에 어떤 정보에 접근하는가?
	- 익스텐션이 얻은 컨텐츠를 어디에 보내는가? 혹은, 로컬에서 처리하는가?
- JS에서 어떤 함수들이 사용되는가(악용될 수 있는 함수의 존재 여부와 사용 방식)?


따라서, JS에서 함수를 살펴보며 리스팅하고 익스텐션에서 검출한 뒤, 그 ==행위를 유추==한다. 우선 살펴볼 함수의 선정 기준은 아래와 같이 다양하게 떠올려 보았다.

- 우리가 보는 웹 컨텐츠에 굉장히 직접적으로 접근하는 함수
- 내부 `HOST`와 통신하는 함수
- 웹 브라우저 컨텐츠를 읽는 함수
- 쿠키 정보를 읽는 함수


악성의 가능성이 있는 함수를 리스팅하고, 함수가 실행될 때의 필요한 `permission` 까지 깊게 조사해보려한다. 그 후, 모델링을 통해 함수의 동작 원리를 추적/유추한다.
모델링의 예는 다음과 같다. 한 익스텐션은 사용자가 입력한 패스워드를 탈취하는 행위를 한다고 가정해보자.
이 행위의 동작 원리는 이러할 것이다:<br>
	1. 화면에 `password` 입력 박스를 선택한다.<br>
	2. `password` 정보를 copy한다.<br>
	3. copy한 정보를 포스트 메시지를 통해 외부 `url`로 보낸다.

아래 이미지는 위 과정처럼 함수의 행위를 리스팅 한 좋은 예시이다(출처: DVa: Extracting Victims and Abuse Vectors from Android Accessibility Malware).
![Figure 2](functions_1.png)

이처럼 함수 리스팅을 통해 다양한 함수가 섞여 악성 트랜잭션을 만들어내는 과정을 모델링 하려고 한다.
대표적인 함수 카테고리는 4개로 구분 가능하다:<br>
	1. 파일시스템 접근<br>
	2. 네트워크 접근<br>
	3. 렌더링 관련<br>
	4. User Interaction(e.g. 좌우 클릭, 드래그, etc)

추가로, 각 익스텐션이 실행될 제약조건 또한 카테고리화하는 것도 고려한다. 예를 들어 웹 사이트의 `status`를 체크하여 특수한 환경에서 작동하는 익스텐션들의 제약 조건을 카테고리화한다면, 익스텐션이 악의적인 목적을 가지고 웹에 접근했을 때 그 익스텐션이 특정 조건에서만 실행되도록 설계되었는지 분석할 수 있다.

악성 익스텐션은 정상적인 환경에서는 활동을 숨기고, 특정 조건(e.g. 특정 도메인, 사용자 로그인 상태, 개발자 도구 비활성화 등)에서만 악성 행위를 수행할 수 있다. 이를 정적 분석을 통해 탐지하려면, 익스텐션이 실행될 **제약 조건**을 카테고리로 분류할 수 있다.

---
## 렌더링


### DOM 조작 관련

> `document.createElement(tagName)` 
- `tagName`에 해당하는 HTML 요소를 동적으로 생성한다.
- 생성된 요소는 DOM에 추가되기 전까지 화면에 보이지 않는다.

>  document.appendChild(node)`
- 지정된 노드를 특정 부모 요소의 마지막 자식으로 추가한다.
- 기존의 다른 부모가 있으면 해당 부모에서 제거된 후 새 부모에 추가된다.

> `element.innerHTML`
- 특정 요소의 HTML 내용을 문자열로 읽거나 설정하는 속성이다
- 기존 내용을 덮어쓰므로, 외부 입력 값을 삽입하는 경우, ==XSS 공격에 취약할 수 있다.==

> `document.querySelector(selector)`
>`document.getElementById(id)`
- CSS 선택자를 사용하여 첫 번째 일치하는 요소를 반환한다.
- ID 값을 기준으로 요소를 반환한다.

> `element.style.*`
- 요소의 스타일을 변경하는 속성이다.
- Example: `style.backgroundColor = "red`

> `Mutation.Observer()`
- DOM 변경을 감지하는 API이다.
- ==크롬 익스텐션에서 웹페이지 변경을 감지하고 자동으로  조치를 취하는 경우 사용된다.==


### Chrome Extension 및 브라우저 API

> `chrome.tabs.executeScript()`
- 현재 활성화된 탭에서 특정 스크립트를 실행하는 API이다.
- `manifest.json`에서 `tabs` 권한이 필요하다.
- ==악성 extension은 이를 이용해 원격 코드를 실행==할 수 있다.

> `setTimeout()`
> `setInterval()`
- 지정된 시간이 지나면 한 번만 실행한다.
- 지정된 간격마다 반복 실행한다.
- ==악성 코드 실행을 지연하는 방법으로 활용==될 수 있다.

>  `canvas.getContext("2d")
>  `CanvasRenderingContext2D.drawImage()`
- HTML canvas 요소를 조작하는 API이다.
- `drawImage()`는 이미지 렌더링에 사용된다.
- ==canvas는 브라우저 핑거프린팅에 악용==될 수 있다.

>  `document.designMode = "on"`
- 웹 페이지의 모든 콘텐츠를 직접 편집 가능하게 만드는 속성이다.
- 본래는 테스트 및 디버깅 용도로 사용하지만, ==악성 확장 프로그램이 페이지 내용을 변경할 수 있다.==

> `shadowRoot`
> `attachShadow()`
- Shadow DOM을 생성하여 요소를 격리된 DOM 트리로 관리한다.
- 악성 extension이 ==난독화된 UI를 삽입==할 수 있다.

>  `window.open()`
> `chrome.windows.create()`
> `chrome.tabs.create()`
- 새 창, 새 브라우저 창, 새 탭을 연다.
- ==광고성 팝업, 피싱 사이트로 redirection하는 extension에서 악용== 가능하다.

> `chrome.notifications.create()`
- Chrome extension에서 알림을 표시하는 API이다.
- ==스팸 알림을 보내거나 피싱 링크를 포함==할 수 있다.

---
## User Interaction


### 이벤트 리스너 (User input listeners)

> `addEventListener("click", ...)`
> `addEventListener("keydown", ...)`
- 클릭, 키 입력 등의 이벤트가 발생하면 지정된 함수를 실행한다.
- *click 이벤트를 가르채서 피싱 버튼 클릭 유도 가능성* 이 있다.

> `document.onmousemove`
> `document.onkeypress`
> `document.onkeydown`
- 마우스 이동 감지, 키 입력 감지, 키보드 입력 감지
- 마우스 움직임 데이터를 기록하면 *사용자 행동 추적 가능성* 이 있다.
- `onkeypress`를 사용하여 *비밀번호 입력 감지 가능성* 이 있다.

> `window.onbeforeunload`
- 페이지 종료를 감지한다.
- *페이지를 떠날 때 데이터를 서버로 전송* 하는지 확인할 필요가 있을 수도 있다.


### 클립보드 접근

> `navigator.clipboard.writeText()`
> `navigator.clipboard.readText()`
- 클립보드에 텍스트를 복사한다.
- 클립보드에서 텍스트를 읽는다.
- ==사용자가 복사한 내용(pw, 카드 번호)을 탈취할 가능성이 있다.==

> `chrome.contextMenus.create()`
- extension에서 브라우저 우클릭 메뉴를 변경할 수 있다.
- *악성 extenion이 우클릭 메뉴를 추가하여 피싱 페이지로 유도할 가능성* 이 있다.


### 예약 작업 수행

>  `chrome.alarms.create()`
- 특정 시간 후에 지정된 작업을 실행하는 예약 기능이다.
- 악성 익스텐션이 ==Delayed Execution==을 수행할 가능성이 있다.

>  `chromenotifications.onClicked.addListener()`
- 익스텐션이 생성한 알림을 클릭했을 때 이벤트를 발생시킨다.
- ==스팸 알림을 통한 악성 사이트 유도 가능성==이 있다.

 > `chrome.permissions.request()`
- 익스텐션이 특정 권한을 요청할 수 있다.
- ==민감한 권한 요청 여부를 확인==한다.
- 정상적인 익스텐션 -> 초기 설치 시 필요한 권한을 한 번에 요청한다.

>  `chrome.tabs.onActivated.addListener()`
- 사용자가 활성화한 탭 변경을 감지한다.
- 특정 웹사이트에서만 실행되는 익스텐션인지 확인한다.


### Open Authorization

> `chrome.identity.getAuthToken()`
- OAuth 인증을 통해 Google API에 접근한다.
- 사용자가 로그인을 하면 OAuth 토큰을 발급받아 특정 Google 서비스에 접근할 수 있다.
- `manifest.json`에서 `identity` 또는 `identity.email` 권한이 필요하다.


### 팝업 메시지

> `window.alerrt()`
> `window.confirm()`
> `window.prompt()`
- 단순 메시지, 확인/취소 버튼이 있는 다이얼 로그, 입력을 받을 수 있는 다이얼 로그.
- ==가짜 보안 경고창을 표시==할 수 있다.