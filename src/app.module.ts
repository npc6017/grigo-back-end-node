import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
@Module({
  imports: [
    AccountModule,
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot(),
    AuthModule,
    TagModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
