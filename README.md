# 실행 방법

### PM2 프로세스 관리자 설정 및 실행
pm2 설치
```
sudo npm install pm2 -g
```
pm2를 사용하면 모니터링이 가능하며,  
프로세스가 중단되어도 자동으로 재실행 한다.

**백그라운드에서 실행**
```
pm2 start ./dist/src/main.js
```

추가적인 pm2 기능 보기
```
pm2 examples
```


### ENV 설정
grigo-back-end-node 디렉토리에 .env파일을 생성한다.
```
HOST=
USERNAME=
PASSWORD=
DATABASE=
SECRET=
TIMEOUT=
PORT=
```
host: 호스트 주소  
username: DataBase 사용자  
password: DataBase 비밀번호  
database: DataBase 이름  
secret: JWT 시크릿 키  
timeout: JWT 토큰 유효 기간  
port: 실행 포트