import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { TagService } from '../tag/tag.service';
import { Tag } from '../entities/Tag';
import { AccountTag } from '../entities/AccountTag';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Tag, AccountTag]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.TIMEOUT },
    }),
  ],
  providers: [AccountService, AuthService, TagService],
  controllers: [AccountController],
})
export class AccountModule {}
