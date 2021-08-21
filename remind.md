### nest dotenv 설정
```
npm install --save @nestjs/config
```
```typescript
// app.modules.ts
import: [ConfigModule.forRoot()]
```
---
### HttpException Custom 처리
root 디렉토리에
http.Exception.filter.ts파일 생성
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { error: string; statusCode: 400; message: string[] };

    if (typeof err !== 'string' && err.error === 'Bad Request') {
      return response.status(status).json({
        status: status,
        errorMessage: err.message[0],
      });
    }
  }
}
```
main.ts 수정
```typescript
app.useGlobalFilters(new HttpExceptionFilter());
```
다음은 httpException으로 걸리는 throw예시,
```
throw new HttpException( // Custom HttpException content
  {
    error: 'Bad Request',
    message: ['이미 가입되어있는 학번입니다.'],
  },
  400,
);
```
위 형식대로 httpException.filter.ts에서 해당되는 예외처리에 처리

---
### Class-validation
도메인 및 DTO 조건 설정 및 검증
```
npm i class-validator

// main.ts에 다음 추가
app.useGlobalPipes(new ValidationPipe());
```
---
### 기존 데이터베이스 Entity 자동 생성하기
```
npx typeorm-model-generator -h localhost -d [디비명] -u [이름] -x [비밀번호]
root폴더 아래 orm폴더 생성됨.
```
---
### DataBase Connection
패키지 설치
```
// nestjs모듈typeorm, typerom, postgres커넥션 설치
npm i --save @nestjs/typeorm typeorm postgres

// postgres 설치
pg설치 하세요
```
root 디렉토리에 ormconfig.ts파일 생성
(root 위치가 아니면 설정 오류가 난다고 들었음, 직접 경험은 아님)
```typescript
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.HOST,
  port: 5432,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [Account, AccountTag, Comment, Notification, Post, PostTag, Tag],
  synchronize: false,
};
module.exports = config;
```
app.module.ts 수정
```typescript
imports: [TypeOrmModule.forRoot(ormconfig)]
```
---
### Service, Controller 에서 Repository 사용하기
사용하려는 도메인을 사용하는 모듈 설정에 정의
```typescript
imports: [TypeOrmModule.forFeature([Account])]
```
Service or Controller 수정
아래 예시는 UserService
```typescript
// UserService 코드의 일부
export class UserService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

```
---
### Passport Local - Jwt
패키지 설치
@types/passport-... 설치 안하면, 모듈 가져오기 위한 코드 최상위 선언부에서 모듈이 안가져와진다.
```
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local

$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt
```
``` typescript
/// local.strategy.ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
    /** { username: ?, passwordField: ? } 아래 validate와 매칭되기 위한 설정
     * 입력받는 id가 email이면 여기서 커스텀이 필요하다. !!!!!!*/
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(email, password);
    const account = this.authService.validateUser(email, password);

    if (!account) new UnauthorizedException();
    return account;
  }
}
```
로그인 요청  
Controller의 HTTP 매핑 메서드가 위해 @UseGuadrs(LocalAuthGuard)가 정의되어있으면 passport local 전략 수행 ->  
local.strategy.ts에서 authService의 validateUser호출하여 유저 여부 검증 ->    
  검증 불통 ->  
unAuthorizationException 예외 처리, 검증 통 -> 
request.user에 응답받은 유저 넣은 후, 대기중이었던 HTTP 매핑 메서드 실행 -> 토큰 발행(login)

토큰으로 요청  
요청 -> @UseGuards(JwtAuthGuard)가 passport jwt 전략 수행으로 메서드 실행 전 이동 ->  
토큰 인증 ->  
인증되면 req.user에 payload데이터(커스텀) 넣은후 대기중이었던 메서드 실행

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
    };
  }
}
```
---
### TypeORM CreateQueryBuilder
```typescript
await this.accountRepository
  .createQueryBuilder('account') // 대상 Eitity
  .where('account.email =:email', { email: email }) // 검색 조건
  .select([ // 가져올 속성들
    'account.email',
    'account.name',
    'account.studentId',
    'account.phone',
    'account.birth',
    'account.sex',
    'account.checkNotice',
  ])
  .leftJoinAndSelect('account.accountTags', 'accountTags')
  .leftJoinAndSelect('accountTags.tag', 'tags')
  .getOne();
```
leftJoin은 단순히 join만 하지만, leftJoinAndSelect는 결과를 같이 가져온다.
```
.leftJoinAndSelect('account.accountTags', 'accountTags')
```
 여기서 'account.accountTags'는 account의 accountTags를 join한다는 즉,
가져온다는 것이고, 그 옆 'accountTags'는 'account.accountTags'의 변수라고
생각하면 쉽다.
```
.leftJoinAndSelect('accountTags.tag', 'tags')
```
 여기서는 첫 번째와 마찬가지로 accunt가 아닌 accountTags를 대상으로 join을 진행한다.

---
### TypeORM Composite Primary Key
```typescript
@Index('account_tag_pkey', ['id'], { unique: true })
@Index('account_tag_composite_pkey', ['account', 'tag'], { unique: true })
@Entity('account_tag', { schema: 'public' })
export class AccountTag {
  constructor(account: Account, tag: Tag) {
    this.account = account;
    this.tag = tag;
  }

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => Account, (account) => account.accountTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Account;

  @ManyToOne(() => Tag, (tag) => tag.accountTags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tag: Tag;
}
```
위 도메인은 Account - AccountTag - Tag 의 다대다 관계를  
one to many, many to one으로 풀어서 account와 tag를 갖는 테이블이다.
여기서 예로 account: 3, tag: 4의 데이터가 중복으로 들어가는 문제를 위해 account와 tag를 composite PK로 설정할 수 있다.  
위 도메인 코드의 2번 라인이 해당 내용을 설정하는 부분이다.