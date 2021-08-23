import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { AccountTag } from '../entities/AccountTag';
import { Tag } from '../entities/Tag';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTag, Tag, Account]),
    forwardRef(() => AccountModule),
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
