
## Docker

도커(Docker)는 어플리케이션을 신속하게 배포하고 실행할 수 있도록 해주는 오픈 소스 컨테이너화 플랫폼이다. 토커는 어플리케이션과 그 의존성을 함께 패키징하여 일관된 실행 환경을 제공함으로써 "한 번 빌드하고 어디서나 실행"할 수 있게 한다.

> [!note] 다음은 도커의 주요 특징과 개념이다.
> **컨테이너**  
>컨테이너는 애플리케이션과 그 모든 종속성을 포함하는 가벼운 독립 실행형 패키지이다. 컨 테이너는 동일한 운영 체제 커널을 공유하면서도 다른 애플리케이션과 격리된 환경에서 실행된다.
>
> **이미지**  
> 도커 이미지(Docker Image)는 컨테이너를 생성하는 데 사용되는 읽기 전용 템플릿이다. 이미 지는 필요한 애플리케이션 코드, 라이브러리, 종속성 등을 포함한다. 이미지는 레이어로 구성되어 효율적으로 저장되고 전송된다.  
>
> **Dockerfile**  
> Dockerfile은 도커 이미지를 빌드하기 위한 설정 파일이다. Dockerfile에는 이미지 생성에 필 요한 명령어와 설정이 포함되어 있다. 이를 통해 일관된 환경을 유지하면서 이미지를 쉽게 빌드 할 수 있다.  
>
**레지스트리**
> 도커 레지스트리(Docker Registry)는 도커 이미지를 저장하고 배포하는 서버이다. 대표적인 공개 레지스트리로 Docker Hub가 있으며, 사용자들은 자신의 이미지를 레지스트리에 업로드하고 다른 사용자와 공유할 수 있다.
> **가상화와의 차이점**  
> 도커는 가상 머신과 달리 호스트 운영 체제의 커널을 공유하여 더 가볍고 빠르다. 가상 머신 은 각자 독립된 운영 체제를 포함하는 반면, 도커 컨테이너는 호스트 운영 체제의 커널을 공유하 여 자원을 더 효율적으로 사용한다.  
>
> **장점**
> - 일관성: 개발 환경과 운영 환경을 일관되게 유지할 수 있어 "개발 환경에서는 잘 되는데 운 영 환경에서는 안 된다"는 문제를 해결한다.
> - 이식성: 어디서나 실행 가능한 컨테이너를 통해 애플리케이션의 이식성을 높인다.
> - 효율성: 자원을 효율적으로 사용하여 더 많은 애플리케이션을 동일한 하드웨어에서 실행할 수 있다.
> - 확장성: 컨테이너 기반의 마이크로서비스 아키텍처를 통해 애플리케이션을 쉽게 확장하고 관 리할 수 있다.

---
## Docker 설치


### 1. 도커 apt 레포 셋업

우선 다음 명령어를 실행하여 도커 apt 레포를 셋업한다.
```
sudo apt-get install ca-certificates curl gnupg sudo install -m 0755 -d /etc/apt/keyrings curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

```
sudo apt get update
```


### 2. 도커 패키지 설치

다음 명령어를 통해 도커 패키지를 설치한다.
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```


### 3. 설치 확인

hello-world 이미지를 실행하는 것을 통해 도커 엔진이 잘 설치되었음을 확인 가능하다.
```
sudo docker run hello-world
```

---
## Docker 명령어


도커 이미지 다운로드
```
sudo docker pull <image>
```

도커 이미지 목록 출력
```
sudo docker images
```

도커 이미지 삭제
```
sudo docker rmi -f <imageID>
```

전체 도커 컨테이너 목록 출력
```
sudo docker ps -a
```

컨테이너 실행
```
sudo docker start <containerID>
```

컨테이너 종료
```
sudo docker stop <containerID>
```

컨테이너 삭제
```
docker rm <containerID>
```
