import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AuthService, AccountService],
})
export class AuthModule {}
