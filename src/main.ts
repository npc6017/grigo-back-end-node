import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../httpException.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // class-validator을 사용하기 위해 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT);
}
bootstrap();
