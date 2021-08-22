import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { TagService } from '../tag/tag.service';
import { Tag } from '../entities/Tag';
import { AccountTag } from '../entities/AccountTag';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Tag, AccountTag]),
    PassportModule.register({ session: false }),
    JwtModule.register({
      // 여기랑 account에서 동일 설정.. 막상 토큰 생성시에는 account 설정을 사용 뭐지..? 일단 둘 다 정의..
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.TIMEOUT },
    }),
  ],
  providers: [AuthService, AccountService, LocalStrategy, JwtStrategy, TagService],
  exports: [AuthService],
})
export class AuthModule {}
