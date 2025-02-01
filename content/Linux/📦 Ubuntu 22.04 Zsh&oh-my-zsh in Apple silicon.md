
## Z shell

zsh(Z shell)는 강력한 기능과 유연한 설정을 제공하는 고급 쉘이다. zsh는 Bash와 유사한 인터페이스를 제공하면서도 여러 가지 추가 기능과 개선된 사용성을 제공한다. zsh는 개발자와 고급 사용자들 사이에서 인기가 높으며, 효율적인 작업 환경을 구축하는 데 큰 도움이 된다. Bash와의 호환성 덕분에 기존 Bash 스크립트를 그대로 사용할 수 있으면서도, zsh의 강력한 기능을 추가로 활용할 수 있다.

---
## ZSH 설치

```
sudo apt install zsh
```


버전 확인을 통해 zsh가 설치되어 있다는 것을 확인한다.
```
zsh --version
```


```
sudo apt install curl
sudo apt install wget
```

- 사용자가 curl 패키지를 설치하기 위해 **sudo apt install curl** 명령어를 입력했다.
- 사용자가 wget 패키지를 설치하기 위해 **sudo apt install wget** 명령어를 입력했다. 시스템이 패 키지 목록을 읽고 의존성을 확인한 후, wget이 이미 최신 버전으로 설치되어 있다는 메시지를 출 력한다.

---
## oh-my-zsh 설치

이제 *oh-my-zsh*를 설치해보자. oh-my-zsh는 zsh 쉘의 확장 프레임워크로 많은 유용한 플러그인과 테마를 제공한다.
oh-my-zsh를 설치하기 위해서는 다음 명령어를 실행해야 한다.
```
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```


터미널의 환경이 바뀐 것을 볼 수 있다. Agnoster로 테마를 변경하기 위해 다음과 같은 설정을 추가로 해준다.
```
vim .zshrc
source .zshrc
```

아래 이미지 "agnoster" 부분의 기본값은 "robbyrussell" 로 되어 있을 것이다. 이미지와 같이 테마를 변경해준다.