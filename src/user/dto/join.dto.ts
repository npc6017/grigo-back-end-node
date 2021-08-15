import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

/** email | name | password | student_id | phone | birth | sex */
export class JoinRequestDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public student_id: number;

  @IsString()
  @IsNotEmpty()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public birth: string;

  @IsString()
  @IsNotEmpty()
  public sex: string;
}
