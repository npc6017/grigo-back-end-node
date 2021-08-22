import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { AccountTag } from '../entities/AccountTag';
import { Tag } from '../entities/Tag';
import { AccountService } from '../account/account.service';
import { Notification } from '../entities/Notification';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTag, Tag, Account, Notification])],
  providers: [TagService, AccountService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
