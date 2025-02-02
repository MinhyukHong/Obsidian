
## Nginx

가벼우면서도 강력한 프로그램을 목표로 원래는 러시아에서 개발되었지만, 2020년대 이후 현재는 미국에서 운영중인 오픈 소스 웹 서버 프로그램이다. '엔진엑스'라고 읽는다. HTTP와 리버스 프록시, IMAP/POP3 등의 서버 구동이 가능하다. Java 서블릿은 대개 Apache의 Tomcat을 연동해서 구동하고, PHP의 경우 PHP-FPM(FastCGI Process Manager)을 연동해서 구동한다.

---
## Nginx 설치

apt 패키지를 이용하여 설치가 가능하다.
```
sudo apt install nginx
```

설치가 완료되었고, Nginx 서비스를 등록하고 실행하려 한다.
```
sudo systemctl enable nginx
sudo systemctl start nginx
```


Nginx 는 설치 시에 UFW(Uncomplicated Firewall)에 자신을 서비스로서 등록한다. 다음 명령어 작업을 통해 Nginx 와 관련된 3개의 프로필을 확인할 수 있다.
```
sudo ufw app list
```

- **Nginx Full** : 80 포트와 443 포트를 모두 연다.
- **Nginx HTTP** : 80 포트만 연다.
- **Nginx HTTPS** : 443 포트만 연다.


아래의 명령어로 80포트와 OpenSSh를 허용해 보았다.
```
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'OpenSSH'
sudo ufw status
sudo ufw enable
```


현재 서비스가 잘 실행되는 지 명령어를 통해 확인하고, 실제로 터미널 창의 모습처럼 문제 없이 실행되는 것을 확인할 수 있다.
```
sudo systemctl status nginx
```
