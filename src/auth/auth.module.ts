import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { AccountModule } from '../account/account.module';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      // 여기랑 account에서 동일 설정.. 막상 토큰 생성시에는 account 설정을 사용 뭐지..? 일단 둘 다 정의..
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.TIMEOUT },
    }),
    forwardRef(() => AccountModule),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
