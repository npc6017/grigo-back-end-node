import { IsNotEmpty, IsString } from 'class-validator';
export class RequestPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  tags: string[];

  @IsNotEmpty()
  boardType: string;
}
