import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/Comment';
import { PostModule } from '../post/post.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]),
    PostModule,
    AccountModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
