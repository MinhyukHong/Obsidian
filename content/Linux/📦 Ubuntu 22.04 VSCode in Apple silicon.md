
## Visual Studio Code

Visual Studio Code는 마이크로소프트에서 오픈소스로 개발하고 있는 소스 코드 에디터이다.
웹 기반으로 기술들로 데스크톱 애플리케이션을 만들 수 있는 깃허브GitHub의 일렉트론Electron을 기반으로 만들어져 MacOS, Linux, Windows 등 메이저 운영체제를 모두 지원한다. 마이크로소프트의 통합 개발 환경(IDE) '비주얼 스튜디오Visual Studio'와 이름이 비슷하지만, 따로 개발되고 있으며 IDE보다는 **코드 에디터**에 가깝다.

---
## VSCode 설치

당연하게도 처음 VSCode를 Ubuntu에 설치할 때에 다음 명령어를 입력했다.
우선 각 패키지의 목록을 업데이트한다(최신 버전과 종속성을 파악).

```
sudo apt update
```

다음으로 본격적인 설치를 하려 했지만, 에러가 발생한다.
```
sudo apt install code
```


**'E: Unable to locate package code'**
위의 같은 에러는 Ubuntu의 패키지 저장소에서 'code' 패키지를 찾을 수 없다는 것을 의미한다. Visual Studio Code (VSCode)는 기본 Ubuntu 저장소에 포함되어 있지 않기 때문에, 이를 설치하기 위해서는 Microsoft의 저장소를 시스템에 추가해야 한다.

그렇다면, Microsoft의 저장소를 시스템의 추가함과 동시에 현재 사용하는 M1 맥북의 기준에서 우분투 가상 머신을 사용하여 VSCode를 설치하는 본격적인 단계를 차례대로 실행해보려 한다.


### 1. Microsoft의 GPG 키 추가

```
wget -q0- https://packages.microsoft.com/keys/microsoft.asc | gpg -- dearmor > packages.microsoft.gpg sudo install -o root -g root -m 644 packages.microsoft.gog /usr/s hare/keyrings/
```


### 2. Microsoft의 저장소를 시스템에 추가

```
sudo sh -c 'echo "deb [arch=amd64, arm64, armhf signed-by=/us/shar e/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code sta ble main" > /etc/apt/sources.list.d/vscode.list'
```


### 3. 패키지 목록 업데이트 및 VSCode 설치

```
sudo apt update
sudo apt install code
```

다음과 같은 창이 등장할 경우 enter를 눌러 그대로 진행하면 된다.


VSCode가 정상적으로 설치된 것을 확인할 수 있다.