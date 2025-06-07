
## 들어가며
---
Proxmox VM Cluster에서 Ubuntu OS를 사용하는데, 키보드 입력이 끊기고 GUI가 뜨지 않은 원인 모를 문제가 발생했다. VM이 BusyBox 셸이나 emergency 모드로 떨어진 것이 아니라, 그래픽 세션이 뜨지 않고 순수 텍스트 콘솔로 부팅된 것이다.

![Figure 1](trouble_ubuntu_01.png)


## 원인 파악 및 상태 확인
---
위의 상황을 살펴보자면, 서비스는 살아 있지만 화면이 보이지 않는다. 이는 VT 전환만 된 것으로 보이며 가상 터미널로 들어갈 수 있는 가능성이 있다. `Ctrl + Alt + F1(or F3, F4)`로 그래픽 세션이 열려 있는 가상 터미널로 들어가보자(Mac의 경우: `fn + control + option + F1`). Ubuntu 22.04/24.04는 Wayload 세션이 보통 `tty1`에 붙는다.
> 따라서 트러블슈팅 flow를 정리하자면 다음과 같다.
> - TTY 로그인 -> 그래픽 서비스 상태 확인.
> - 필요하다면 `systemctl restart gdm3`로 재시작.


## Trouble Shooting

### 1. GRUB Recovery Mode 진입
---
현재 맥OS 환경에서 실행하고 있기 때문에 `fn + control + option + F1`로 로그인 터미널을 띄웠다.
하지만 username을 정확히 입력하지 못해서 계속해서 로그인이 실패하는 상황이었다.
이에 따라 ==GRUB Recovery Mode(단일 사용자 모드)==로 진입하여 username을 찾아야 한다.

1. VM을 재부팅하고, 부팅 직후 `esc` 또는 `shift`를 반복해서 눌러 GRUB 메뉴를 띄운다.
2. 화살표로 **Advanced options for Ubuntu**를 선택하고, 커널 항목 중 **(recovery mode)** 가 붙은 항목을 선택하여 `Enter`.
![Figure 2](trouble_ubuntu_02.png)
3. 곧 뜨는 복구 모드에서 **root - Drop to root shell prompt** 선택.
	- 암호를 요구하지 않는 경우가 대부분이다. 만일 읽기 전용으로 마운트되어 있으면 다음 단계에서 `mount -o remount,rw /` 한 줄만 먼저 실행한다.
![Figure 3](trouble_ubuntu_03.png)
## 2. 루트 셸에서 사용자 ID 확인
---
```
# 홈 디렉터리 이름 확인
ls /home
# 또는 /etc/passwd에서 UID≥1000(일반 계정)만 뽑기
awk -F: '$3>=1000 && $3<65534 {print $1}' /etc/passwd
```

- 보통 ISO로 설치한 VM이라면 설치 과정에서 입력한 계정이 그대로 나온다.
- 혹은 클라우드 이미지라면 기본이 ubuntu 계정일 수 있다.
- 또한 비밀번호도 재설정 해주었다.
```
passwd <찾은_사용자명>
# 새 비밀번호 두 번 입력
```

- 재부팅 후 로그인한다.
```
reboot
```
![Figure 4](trouble_ubuntu_04.png)
## 3. GUI 세션 수동 실행
---
![Figure 5](trouble_ubuntu_05.png)
> **방법 1**
- 터미널에서 다음 명령을 입력해 X 세션을 수동으로 시작할 수 있다.
- 이 방법은 `xserver-xorg`, `xinit`, `gnome-session` 등의 패키지가 설치되어 있어야 한다.
```
startx
```


> **방법 2**
- Ubuntu 24.04에서 기본적으로 GUI 로그인 화면을 띄우는 서비스는 `gdm`이다. 이 서비스가 백그라운드에서 실행 중인지 확인하고, 수동으로 재시작할 수 있다.
- 그리고 현재 `gdm` 상태도 확인할 수 있다.
```
sudo systemctl restart gdm
systemctl status gdm
```
![Figure 6](trouble_ubuntu_06.png)
![Figure 7](trouble_ubuntu_07.png)
하지만 현재 GNOME Display Manager (gdm)가 *core dump* 오류로 실패하고 있다.
이는 `gdm3` 실행 중에 치명적인 오류(SIGTRAP)가 발생해 프로세스가 죽었다는 의미이다. 이에 대해서는 여러 가지 원인이 있을 수 있겠지만, 정확한 오류의 원인을 파악하기 위해 에러 메시지를 확인한다.

```
# 정확한 에러 메시지 확인
journalctl -xeu gdm | tail -n 50
```
![Figure 8](trouble_ubuntu_08.png)
```
# 핵심 원인
GdmSession: no session desktop files installed, aborting...
```

핵심 원인은 `gdm`은 잘 실행되었지만 GUI 세션을 시작할 수 있는 데스크탑 환경(e.g., GNOME, XFCE, etc.)이 설치되어 있지 않아서 실패한 것이다. 즉, 로그인 매니저는 있지만 표시할 데스크탑 세션이 없다는 의미이다(GDM이 core-dump로 죽음).


## 4. GNOME 데스트탑 설치
---
아래 명령을 통해 전체 GNOME 데스크탑 환경을 설치한다.

```
sudo apt update
sudo apt install ubuntu-desktop
```
![Figure 9](trouble_ubuntu_09.png)

설치가 완료되면,

```
sudo systemctl restart gdm
```
![Figure 10](trouble_ubuntu_10.png)
그 후에 `fn + control + option + F1`을 실행하면 다시 GUI 로그인 화면이 정상적으로 뜬다.
![Figure 11](trouble_ubuntu_11.png)
![Figure 12](trouble_ubuntu_12.png)

## 포인트
---
1. username과 pw로 로그인
2. 명확한 usernme을 모를 경우, VM을 재부팅하고 esc를 연타하여 ==GRUB Recovery Mode 진입==
3. 로그인 매니저 `gdm` 및 데스크탑 환경 GNOME 설치