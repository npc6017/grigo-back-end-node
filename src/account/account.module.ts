import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.TIMEOUT },
    }),
  ],
  providers: [AccountService, AuthService],
  controllers: [AccountController],
})
export class AccountModule {}
