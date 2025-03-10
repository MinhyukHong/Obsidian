
VS Code를 설치하여 우분투 환경에서 코드를 작성하는 경험을 했다.
[VS Code 설치 참고](https://prospero-mivida.tistory.com/15](https://prospero-mivida.tistory.com/15)

이제는 작성한 코드를 효과적으로 관리하기 위해 **VCS(Version Control System)** 를 우분투 환경에서 사용해보기로 했다. 대표적인 VCS인 Git은 파일의 변경 내역을 추적하고 여러 사용자 간의 파일 작업을 조율하는 데 유용하다. 우분투 환경에 Git을 설치한 후, Git과 관련된 다양한 명령어를 직접 입력하여 사용해보았다.

---
## git 설치

터미널에 다음 명령어를 입력하면 간단하게 git이 설치된 것을 확인할 수 있다.

```
sudo apt-get install git
```

이제 git을 설치했으니 git과 관련하여 간단한 명령어를 CLI 환경에서 입력해보자.

---
## git 명령어

```
git help
```

git help commit을 입력하여서 commit 명령어에 대한 도움말을 확인한다.

> - `git help`: 사용법이 궁금한 명령어에 대해 git help {궁금한 명령어} 를 입력하면 해당 깃 명령어의 설정과 사용에 대한 도움말을 출력.
> - `git init`: 깃 저장소를 초기화하는 명령어. 저장소나 디렉토리 안에서 이 명령어를 실행해야만 버전 관리가 가능.
> - `git status`: 저장소의 상태를 확인하는 명령어. 어떤 파일이 저장소 안에 있으며 변경 사항이 있는 지, 현재 저장소의 어느 브랜치에서 작업하고 있는 지 등의 상태 정보를 출력.
> - `git branch`: 새로운 브랜치를 생성하는 명령어. 여러 사람과 협업할 경우 해당 명령어를 통해 새로운 브랜치를 만들고 자신만의 변경 사항과 파일 추가 등의 커밋 타임라인을 생성하며 이후 협업자의 branch 혹은 main branch와 merge하며 작업 진행.
> - `git add`, `git commit`: git add 를 통해 Working Area에서의 변경 사항을 Staging Area로 추가하고, `git commit` 을 통해 Staging Area 에 있는 변경 내용을 하나로 묶어 정의.
> - `git push`: 저장소를 의미하는 Repository에 커밋된 변경 사항을 'push'하는 명령어.
> - `git pull`: 저장소에 있는 최신버전의 코드를 로컬 컴퓨터로 가져오는 명령어.
> - `git clone`: 저장소에 있는 데이터를 로컬 컴퓨터에 복사하는 명령어.


진행했던 프로젝트의 레포지토리를 가상머신에 복사해 보았다. Github에서는 git clone 을 편리하게 할 수 있도록 기능을 제공한다. 복사한 나의 레포지토리를 git clone 명령어 뒤에 붙여 다음과 명령어를 수행하면 가상머신에 복사가 완료된다.
```
git clone {Repository}
```
