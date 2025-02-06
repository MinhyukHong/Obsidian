
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
## 렌더링 관련 (Rendering & UI Manipulation)

- `document.createElement()`, `document.appendChild()`, `elementinnerHTML`
- `document.querySelector()`, `document.getElementById()`
- `element.style.*`
- `Mutation.Observer()`
- `chrome.tabs.executeScript()`
- `setTimeout()`, `setInterval()`
- `requestAnimationFrame()`
- `canvas.getContext("2d"), CanvasRenderingContext2D.drawImage()`
- `document.designMode = "on"`
- `shadowRoot`, `attachShadow()`
- `window.open()`, `chrome.windows.create()`, `chrome.tabs.create()`
- `chrome.notifications.create()`

---
## 유저 인터렉션 (User Interaction)

- `addEventListener("click", ...)`, `addEventListener("keydown", ...)`
- `document.onmousemove`, `document.onkeypress`, `document.onkeydown`
- `window.onbeforeunload` (페이지 종료 감지)
- `navigator.clipboard.writeText()`, `navigator.clipboard.readText()` (클립보드 접근)
- `chrome.contextMenus.create()` (우클릭 메뉴 추가)
- `chrome.alarms.create()` (예약 작업 수행)
- `chromenotifications.onClicked.addListener()` (알림 클릭 이벤트 감지)
- `chrome.permissions.request()` (권한 요청)
- `chrome.tabs.onActivated.addListener()` (탭 활성화 감지)
- `chrome.identity.getAuthToken()` (OAuth 인증)
- `window.alerrt()`, `window.confirm()`, `window.prompt()` (팝업 메시지)

