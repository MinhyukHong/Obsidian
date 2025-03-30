## 들어가며
---
**ELK 스택**이란 Elasticsearch, Logstash, Kibana의 세 가지 인기 있는 프로젝트로 구성된 스택을 의미한다. Elasticsearch라고돌 불리는 ELK 스택은 사용자에게 모든 시스템과 애플리케이션에서 로그를 집계하고 이를 분석하며 애플리케이션과 인프라 모니터링 시각화를 생성하고, 빠르게 문제를 해결하며 보안 분석을 수행할 수 있는 능력을 제공한다.

2~3년 전, Elasticsearch 8.0 버전이 릴리즈 된 것이 무섭게 굉장히 빠른 속도로 마이너 버전이 올라가 벌써 현재 2025년 3월 기준 `8.17.3` 버전까지 릴리즈 되었다.
이 글에서는 `8.17.3` 버전의 Elasticsearch와 Kibana를 직접 설치하는 과정, 과정 중 발생한 문제 해결에 대해 정리한다.

### 설치 환경
---
OS: M1 Mac
Elasticsearch version: `8.17.3`
Kibana version: `8.17.3`


## Elasticsearch
---
[다운로드 페이지](https://www.elastic.co/kr/downloads/elasticsearch)에서 받을 수 있으며 설치하고자 하는 OS에 맞춰 다운로드 받을 것을 권장한다. 현재 환경에 맞게 본인은 `macOS aarch64`를 선택했다.

다운로드 받은 directory로 이동해서 압축을 푼다.
```
$ tar -zxf elasticsearch-8.17.3-darwin-aarch64.tar.gz
```
![Figure 1](ELKDownload_1.png)
위 명령어를 사용하면 압축이 해제된다.
실행 자체는 간단한데, 압축 해제 후 elasticsearch-8.17.3 directory로 이동한 다음 명령어를 입력하면 된다.
```
$ bin/elasticsearch
```
![Figure 2](ELKDownload_2.png)
하지만 다음과 같은 로그가 보였고, 이는 Elasticsearch 실행이 실패한 상황을 보여주고 있다.
![Figure 3](ELKDownload_3.png)
핵심 에러는 다음과 같다:
```
/bin/elasticsearch-cli: line 14: /jdk.app/Contents/Home/bin/java: No such file or directory
```

==원인==: Elasticsearch는 내부적으로 자체 JDK(Java Development Kit)를 사용하려고 시도하는데, `jdk.app/Contents/Home/bin/java` 경로가 존재하지 않아 실행에 실패한 상태이다.

해결 방법은 2가지가 있는데:
1. 시스템에 설치된 Java를 사용하도록 설정하거나,
2. 누락된 내부 JDK를 다시 다운로드하는 것이다.

나는 *방법 1*로 트러블슈팅을 진행해보았다.
우선 시스템에서 Java 설치 여부를 확인하고 환경변수를 설정한다.
`Elasticsearch 8.x`는 기본적으로 `Java 17` 이상이 필요하다.
![Figure 4](ELKDownload_4.png)
하지만 위 방법으로도 해결이 되지 않는다면, Elasticsearch에서 여전히 내장 JDK(`jdk.app`)를 찾는 것을 실패하는 것으로 볼 수 있다.
이 때는 Elasticsearch가 시스템 Java를 사용하도록 강제할 수 있다.
`ES_JAVA_HOME`은 Elasticsearch가 참조하는 JDK 경로이다.
```
$ export JAVA_HOME=$(/usr/libexec/java_home)
$ export ES_JAVA_HOME=$JAVA_HOME
```
![Figure 5](ELKDownload_5.png)
하지만 이러한 방법에도 쉽게 문제해결이 되지 않았다. 그 이유는 Elasticsearch 디렉토리 내 설정이 강제로 내장 JDK를  참조하도록 되어 있기 때문이다.
`Elasticsearch 8.17.3`은 기본적으로 `/jdk.app/Contents/Home/bin/java`를 참조하도록 심볼릭 링크가 걸려있을 수 있다. 이 경로가 존재할 경우, 시스템 Java를 무시하고 심볼릭 링크를 고집하게 된다.
따라서 이 경우 완전한 해결 방법은 `jdk.app` ==경로를 제거하는 것==이다.

- `jdk.app` 삭제
```
$ rm -rf jdk.app
```

![Figure 6](ELKDownload_6.png)
Elasticsearch가 드디어 성공적으로 실행되었다.
![Figure 7](ELKDownload_7.png)
이제 브라우저에서 `http://localhost:9200` 주소로 접속한다.
(또는 터미널에서 `curl` 명령어: `curl http://localhost:9200`)

![Figure 8](ELKDownload_8.png)
username과 password는 처음 Elasticsearch 실행 시 콘솔 로그에 출력된다.
![Figure 9](ELKDownload_9.png)
만약 콘솔 로그를 놓쳤다면 명령어로 비밀번호를 재설정할 수 있다.
```
$ ./bin/elasticsearch-reset-password -u elastic
```

인증에 성공하면 다음과 같은 화면이 등장한다. 다음 JSON 응답은 Elasticsearch 서버가 정상적으로 실행되고, 인증을 통과한 상태라는 걸 의미한다.

![Figure 10](ELKDownload_10.png)


## Kibana
---
Kibana는 설치한 Elasticsearch와 동일한 버전인 8.17.3 버전으로 설치한다. [다운로드 페이지](https://www.elastic.co/kr/downloads/kibana)에서 받을 수 있으며 OS에 맞춰 다운로드 한다.

Elasticsearch와 마찬가지로 다운로드 받은 directory로 이동하여 압축을 해제한다.
```
$ tar -zxf kibana-8.17.3-darwin-aarch64.tar.gz
```
![Figure 11](ELKDownload_11.png)
실행도 시켜준다.
```
$ cd kibana-8.17.3
$ bin/kibana
```
![Figure 12](ELKDownload_12.png)
위의 콘솔 로그 메시지를 참고하면 Kibana가 정상적으로 실행 중이며, 최초 설정(초기화 마법사)을  기다리는 상태라는 것을 알 수 있다.
`http://localhost:5601/?code=084162` 주소로 브라우저에서 접속하면 Kibana의 초기 설정 화면이 뜨고, Elasticsearch와의 연결 및 기본 설정을 하게 된다.
![Figure 13](ELKDownload_13.png)
위 화면에서는 token을 요청하고 있다.
이 부분이 버전 7과 달라진 부분인데, Elasticsearch와 연동하는 부분에서 보안이 더 강화되었다. 이전에 Elasticsearch 설치 부분에서 나타났던 로그 중에서 아래 화면처럼 *Configure Kibana to use this cluster* 부분에 있는 token을 복사하여 붙여넣어준다.
참고로 30분 한정 유효한 토큰이므로 Elasticsearch 최초 실행 30분 내에 Kibana를 실행하여 위 텍스트 박스에 적용하면 된다.
![Figure 14](ELKDownload_14.png)
token을 입력하고 *Configure Elastic*을 누르면 셋업이 진행된다.
![Figure 15](ELKDownload_15.png)
셋업은 최초 1회만 진행되며, 이후 로그인 페이지가 나오고 앞으로 키바나를 실행시키면 아래와 같은 로그인 페이지가 나타날 것이다. 미리 디폴트로 생성한 Elastic 계정으로 로그인하면 된다.
![Figure 16](ELKDownload_16.png)
로그인 인증이 완료되면 Kibana를 활용할 수 있는 아래 페이지가 등장한다.
![Figure 17](ELKDownload_17.png)
