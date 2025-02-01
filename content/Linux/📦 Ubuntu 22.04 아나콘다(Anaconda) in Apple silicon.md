
## 아나콘다
아나콘다는 기본적으로 여러 가지 패키지가 포함된 Python 자유-오픈소스 배포판이다. 하나의 PC에서 여러 프로젝트를 진행하다 보면 많은 라이브러리와 패키지들을 사용하게 된다. 이 때 아나콘다는 프로젝트 별로 가상환경을 구성하여 충돌 가능성을 없애주고, 독립적인 프로그래밍을 가능하게 해준다. 아나콘다 내부적을 conda라는 패키지 관리자가 존재하여 가상환경 별로 독립적인 패키지 관리 또한 가능하다.

---
## 아나콘다 설치

리눅스의 장점이라 한다면 **터미널과 스크립팅**을 언급할 수 있다. 리눅스는 터미널 명령어를 통해 강력한 기능을 제공한다. 명령어를 스크립트로 작성하여 다양한 작업을 수행하고 자동화할 수 있다. 따라서 다양한 명령어를 익히는 것은 리눅스 사용의 기본이다.

다음과 같은 명령어를 순서대로 실행하면 아나콘다를 설치할 수 있다. 이는 애플 실리콘 M1의 기준의 설치 가이드이다.

### 1. apt update

```
sudo apt update
```


### 2. curl 패키지 설치

```
sudo apt install curl -y
```


### 3. 아나콘다 설치

이 단계에서 주의를 해야 한다. M1 맥북에서 UTM을 통해 우분투 운영체제를 경험하고 있기 때문에 arm64 아키텍처에 호환되는 다음 파일을 가져와야 한다. 호환되지 않는 파일을 가져온다면 'cannot execute binary file: Exec format error' 메시지가 뜨게 된다.
[참고](https://repo.anaconda.com/archive/)

```
curl --output anaconda.sh https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-aarch64.sh
```

```
sha256sum anaconda.sh
```

계속해서 등장하는 약관을 넘기고 최종적으로 yes를 해주면 설치가 완료된다.


### 4. conda 명령어 환경변수 추가

```
sudo vi ~/.bashrc
```

`.bashrc`를 편집하여 마지막 줄에 다음 명령어를 추가해준다.

```
export PATH=~/anaconda3/bin:~/anaconda3/condabin:$PATH
```

마지막 줄에 추가 후 :wq로 저장하고 빠져나온다.
(:wq 명령이 동작하지 않는 경우가 있는데, esc 키를 두 번 누른 뒤 실행하도록 한다)


### 5. 환경변수 내용 update

```
source ~/.bashrc
```


### 6. 설치 확인

설치가 정상적으로 되었다면 다음 명령어를 통해 버전을 확인할 수 있다.

```
conda -v
```

명령어가 정상 작동하는 것을 확인할 수 있다.

---
## `conda` 명령어로 가상환경 설정

```
conda create -n {가상환경이름} python={원하는 파이썬 버전}
```

이제 가상환경을 정상적으로 실행 가능하다.

conda를 activate 시킬 때, Run 'conda init' before 'conda activate'와 같은 메시지를 마주할 수도 있다.

이 때는 다음 명령어를 실행하도록 한다.
```
source ~/anaconda3/etc/profile.d/conda.sh
```

가상환경에서 설치된 파이썬 라이브러리를 확인해본다면, 본인이 하고자 하는 작업에 필요한 라이브러리들만 설치하거나 라이브러리 간의 의존성 충돌을 requirements.txt를 통해 가상환경에 설치하면서 손쉽게 해결할 수 있다는 것을 깨닫는다.
```
pip list
```

---
## jupyter 설치

아나콘다 설치 후에 주피터 노트북 또한 설치해보았다. 설치 과정은 아나콘다보다 매우 간단하기 때문에 올바른 명령어만 입력한다면 손쉽게 가능하다.


### 1. jupyter 설치

```
sudo apt install jupyter
```


### 2. 설치 확인

```
jupyter --version
```

다음 명령어는 jupyter를 처음 설치했거나, 특정 jupyter 명령어를 어떻게 사용하는지 알아보려고 할 때 유용하다. 예를 들어, jupyter 노트북 서버를 시작하는 방법, 구성 옵션을 설정하는 방법, 다양한 서브커맨드 등을 알 수 있다.
```
jupyter --help
```

jupyter --help 명령어는 우분투 운영 체제에서 Jupyter 노트북 또는 Jupyter 관련 툴에 대한 도움말 정보와 사용 가능한 명령어 옵션들을 보여준다. 이 명령어를 사용하면 Jupyter를 사용하는 데 도움이 되는 다양한 명령어와 인자, 그리고 설정에 관한 정보를 얻을 수 있다.


### 3. 실행

```
jupyter notebook
```


명령어를 입력하면 창이 열리며 주피터 노트북이 실행된다.