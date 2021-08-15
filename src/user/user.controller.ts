import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinRequestDto } from './dto/join.dto';
import { ResponseDTO } from './dto/responst.dto.will.delete';

@Controller('/')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/join')
  async login(@Body() account: JoinRequestDto): Promise<string | ResponseDTO> {
    /** Check isUser(email) */
    await this.userService.findByEmail(account.email).then((account) => {
      if (account) {
        throw new HttpException( // Custom HttpException content
          {
            error: 'Bad Request',
            message: ['이미 가입되어있는 이메일입니다.'],
          },
          400,
        );
      }
    });
    /** Check isUser(student_id) */
    await this.userService
      .findByStudentId(account.student_id)
      .then((account) => {
        if (account) {
          throw new HttpException( // Custom HttpException content
            {
              error: 'Bad Request',
              message: ['이미 가입되어있는 학번입니다.'],
            },
            400,
          );
        }
      });

    /** Join */
    return await this.userService
      .join(account)
      .then(() => {
        return new ResponseDTO(
          200,
          '회원가입을 축하합니다!',
        ); /** ResponseDTO는 기존 서버와 통합을 위해 임시 사용.. 추후 방식 개편 할거임.. */
      })
      .catch((err) => {
        console.error(err);
        throw new HttpException( // Custom HttpException content
          {
            error: 'Bad Request',
            message: ['서버에서 문제가 발생하였습니다.'],
          },
          400,
        );
      });
  }
}
