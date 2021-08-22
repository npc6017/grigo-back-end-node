import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PostService } from '../post/post.service';
import { AccountService } from '../account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/Comment';
import { TagService } from '../tag/tag.service';
import { Post } from '../entities/Post';
import { PostTag } from '../entities/PostTag';
import { Tag } from '../entities/Tag';
import { AccountTag } from '../entities/AccountTag';
import { Notification } from '../entities/Notification';
import { Account } from '../entities/Account';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, AccountTag, Account, Post, Tag, PostTag, Notification])],
  providers: [CommentService, PostService, TagService, AccountService],
  controllers: [CommentController],
})
export class CommentModule {}
