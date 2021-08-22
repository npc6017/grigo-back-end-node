import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TagService } from '../tag/tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../entities/Tag';
import { Post } from '../entities/Post';
import { AccountTag } from '../entities/AccountTag';
import { Account } from '../entities/Account';
import { AccountService } from '../account/account.service';
import { PostTag } from '../entities/PostTag';
import { Notification } from '../entities/Notification';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTag, Account, Post, Tag, PostTag, Notification]),
  ],
  providers: [PostService, TagService, AccountService],
  controllers: [PostController],
})
export class PostModule {}
