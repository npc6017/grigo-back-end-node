import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../entities/Tag';
import { Post } from '../entities/Post';
import { PostTag } from '../entities/PostTag';
import { Notification } from '../entities/Notification';
import { AccountModule } from '../account/account.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Tag, PostTag, Notification]),
    AccountModule,
    TagModule,
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
