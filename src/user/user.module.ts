import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
