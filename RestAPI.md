# URI 체크리스트
### Base URL : http://localhost:8080
# Account
## 회원가입 O
POST
**/join**
> Request
```
body
{
	"email" : "sol2@gmail.com",
	"password" : "12345678",
	"name": "solchan",
	"birth" : "980427",
	"student_id" : "33",
	"sex" : "male",
	"phone" : "32330427"
}
```
> Response

**200: OK**
```
body
{
    "status": 200,
    "errorMessage": "회원가입을 축하합니다!."
}
```
**400: Bad Request**
필요한 정보가 입력되지 않은 경우,
이메일 또는 학번이 이미 가입되어 있는 경우,
```
{
    "status": 400,
    "errorMessage": "	이미 사용중인 이메일입니다."
}
```
---
## 로그인 O
POST
**/login**
> Request
```
body
{
    "email": "sol1@gmail.com",
	  "password" : "12345678"
}
```
> Response
> 
**213 or 214: OK**
태그가 있는 경우 213, else 214
```
body
{
    "email": "sol1@gmail.com",
    "name": "solchan",
    "student_id": 1,
    "phone": "32330427",
    "birth": "980427",
    "sex": "male",
    "checkNotice": false,
    "tags": [
        "노드",
        "그리고"
    ]
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 나의 정보 조회 O
GET
**/profile**
> Request
```
header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
body
{
    "email": "sol1@gmail.com",
    "name": "solchan",
    "student_id": 1,
    "phone": "32330427",
    "birth": "980427",
    "sex": "male",
    "tags": ['노드', '그리고'],
 /* "addTags": null, 이 부분은 필요없지 않나?
    "deleteTags": null nestjs서버에서는 응답 안하는걸로.. */
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 회원정보 수정 O
POST
**settings/profile**
> Request
```
header
authorization = bearer toooookeeen...

body
{
	"phone": "3434",
	"birth": "0427",
	"addTags": ["JPA", "안드로이드"],
	"deletedTags": ["..."]
}
```
> Response

**200: OK**
```
body
{
    "email": "sol1@gmail.com",
    "name": "solchan",
    "student_id": 1,
    "phone": "3434",
    "birth": "0427",
    "sex": "male",
    "tags": ['노드', '그리고'],
 /* "addTags": null, 이 부분은 필요없지 않나?
    "deleteTags": null nestjs서버에서는 응답 안하는걸로.. */
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 비밀번호 수정 O
POST
**/settings/password**
> Request
```
header
authorization = bearer toooookeeen...

body
{
	"currentPassword": "12345678",
	"newPassword": "12341234",
	"newPasswordConfirm": "1234123"
}
```
> Response

**200: OK**
```
{
    "status": 200,
    "errorMessage": "비밀번호가 성공적으로 변경되었습니다."
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
**400: Bad Request**
현재 비밀번호 또는 새로운 비밀번호가 일치하지 않는 경우
```
{
    "status": 400,
    "errorMessage": "비밀번호가 일치하지 않습니다."
}
OR
{
    "status": 400,
    "errorMessage": "새로운 비밀번호가 일치하지 않습니다."
}
```
---
# Notification
## 알림 조회 O
GET
**/notification**
> Request
```
header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
[
    {
        "id": 8,
        "postId": 45,
        "title": "우루루쾅쿠ㅏㅇ"
    },
    {
        "id": 9,
        "postId": 46,
        "title": "케ㅔ케케케ㅔ"
    }
]
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 알림 읽음 O
GET
**/notification/{postId}**
> Request
```
param
postId = 읽음처리 하려는 post의 id

header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```

```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
# Tag
## 나의 태그 설정(단순  추가) O
POST
**/tag/setting**
> Request
```
header
authorization = bearer toooookeeen...

body
{
    "tags": ['스프링', '노드']
}
```  
> Response

**215**
```
header
status = 215


```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 나의 태그 조회 O
GET
**/tag/setting**
> Request
```
header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
{
    "tags": [...]
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
# Post
## 게시글 작성 O
POST
**posts/save**
> Request
```
header
authorization = bearer toooookeeen...

body
{
	"title" : "1번 게시글",
	"boardType" : "free",
	"tags" : ["JPA", "안드로이드"],
	"content" : "1번 테스트 게시글"
}

```
> Response

**200: OK**
```
body(Juse message)
post save successful
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---

## 게시글 조회(단일) O
POST
**posts/{postId}**
> Request
```
param
postId = 가져오려는 post의 id

header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
{
    "id": 1,
    "title": "수정한 첫번째 가능?",
    "writer": "jihwan",
    "content": "이거 보여주려고 어그로 끌었다. 실화냐? 가슴이 웅장해진다. 우리 시간표 이거 맞냐? 가슴이 미어진다ㅠㅠㅠ",
    "boardType": "free",
    "tags": [
        "kuber"
    ],
    "comments": [
        {
            "id": 8,
            "content": "API 동작 테스트 중",
            "writer": "solchan",
            "timeStamp": "2021-08-12T11:49:22.72912",
            "userCheck": false
        }
    ],
/** "addTags": [], nestjs 서버 응답 데이터에서는 삭제
    "deleteTags": [], */
    "timeStamp": "2021-08-07T21:50:06.689845",
    "userCheck": false
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 게시글 조회(여러개) O
POST
**posts/board?id=OO&size=OO&type=OO**
> Request
```
Query
id: 마지막 인덱스, 큰 값이 오면 첫 인덱싱 시작
size: 가져오려는 게시글 개수
type: free or question

header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
{
    "postDTOS": [
        {
            "id": 31,
            "title": "222",
            "writer": "solchan",
            "content": "asdasdas",
            "boardType": "free",
            "tags": [
                "Java",
                "JPA"
            ],
            "comments": [],
            "timeStamp": "2021-08-18T20:00:57.914Z",
            "userCheck": true
        },
        {
            "id": 30,
            "title": "222",
            "writer": "solchan",
            "content": "asdasdas",
            "boardType": "free",
            "tags": [
                "Java",
                "JPA"
            ],
            "comments": [],
            "timeStamp": "2021-08-18T20:00:57.796Z",
            "userCheck": true
        },
        {
            "id": 29,
            "title": "222",
            "writer": "solchan",
            "content": "asdasdas",
            "boardType": "free",
            "tags": [
                "Java",
                "JPA"
            ],
            "comments": [],
            "timeStamp": "2021-08-18T20:00:57.712Z",
            "userCheck": true
        }
    ],
    "hasNext": true
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 게시글 수정 O
POST
**posts/{postId}/update**
> Request
```
param
postId = 수정하려는 post의 id

header
authorization = bearer toooookeeen...

body
{
	"title": "API 테스트 중",
	"content": "API 테스트 중, 이건 내용",
	"boardType": "free",
	"deletedTags": [],
	"addTags": ["google"]
}
```

> Response

**200: OK**
```
body(Juse message)
post update successful
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
**403: Forbidden**
본인 게시글이 아닌 경우,
```
{
    "statusCode": 403,
    "message": "Forbidden"
}
```
---
## 게시글 삭제 O
POST
**posts/{postId}/ delete**
> Request
```
param
postId = 삭제하려는 post의 id

header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
body(Juse message)
post delete successful
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
**403: Forbidden**
본인 게시글이 아닌 경우,
```
{
    "statusCode": 403,
    "message": "Forbidden"
}
```
---
# Comment
## 댓글 작성 O
POST
**{postId}/comment**
> Request
```
param
postId = 추가하려는 post의 id

header
authorization = bearer toooookeeen...

body
{
	"content" : "API 동작 테스트 중"
}
```
> Response

**200: OK**
```
body(Juse message)
댓글을 성공적으로 작성하였습니다.
```
**400: Bad Request**
댓글이 존재하지 않는 경우
```
{
    "statusCode": 400,
    "message": "Bad Request"
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 댓글 수정 O
POST
**comment/change/{commentId}**
> Request
```
param
commentId = 수정하려는 comment의 id

header
authorization = bearer toooookeeen...

body
{
	"content": "API 동작 테스트 중, 수정!"
}
```
> Response

**200: OK**
```
body(Juse message)
댓글을 성공적으로 수정되었습니다.
```
**403: Forbidden**
본인 댓글이 아닌 경우,
```
{
    "statusCode": 403,
    "message": "Forbidden"
}
```
**400: Bad Request**
댓글이 존재하지 않는 경우
```
{
    "statusCode": 400,
    "message": "Bad Request"
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```
---
## 댓글 삭제 O
POST
**comment/{commentId}**
> Request
```
header
authorization = bearer toooookeeen...
```
> Response

**200: OK**
```
body(Juse message)
댓글을 정상적으로 삭제되었습니다.
```
**403: Forbidden**
본인 댓글이 아닌 경우,
```
{
    "statusCode": 403,
    "message": "Forbidden"
}
```
**400: Bad Request**
댓글이 존재하지 않는 경우
```
{
    "statusCode": 400,
    "message": "Bad Request"
}
```
**401: Unauthorized**
토큰 정보가 유효하지 않는 경우
```
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```