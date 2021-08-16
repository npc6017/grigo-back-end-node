import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from './src/entities/Account';
import { AccountTag } from './src/entities/AccountTag';
import { Comment } from './src/entities/Comment';
import { Notification } from './src/entities/Notification';
import { Post } from './src/entities/Post';
import { PostTag } from './src/entities/PostTag';
import { Tag } from './src/entities/Tag';
import * as dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.HOST,
  port: 5432,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [Account, AccountTag, Comment, Notification, Post, PostTag, Tag],
  synchronize: true,
};
module.exports = config;
