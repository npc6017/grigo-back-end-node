import {
  Body,
  Controller,
  Get,
  HttpException, HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JoinRequestDto } from './dto/join.dto';
import { ResponseDTO } from './dto/responst.dto.will.delete';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileDto } from './dto/profile.dto';
import { TagService } from '../tag/tag.service';

@Controller('/')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
  ) {}

  /** JOIN */
  @Post('/join')
  async join(@Body() account: JoinRequestDto): Promise<string | ResponseDTO> {
    /** Check isUser(email) */
    await this.accountService.findByEmail(account.email).then((account) => {
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
    await this.accountService
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
    return await this.accountService
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
  /** Login */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req,
    @Response() res,
    @Body('email') email,
  ): Promise<string> {
    const token = await this.authService.login(email); // Token 생성
    const account = await this.accountService.getMyProfile(email); // 사용자 Full 정보
    res.setHeader('authorization', token);

    // TODO 계정의 태그 유무 확인 후
    /// 없으면 214 응답
    if( account.tags.length == 0) {
      res.status(214);
      return res.json(account);
    }
    /// 있으면 213 응답
    res.status(213);
    return res.json(account);
  }
  /** Get Profile */
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getMyProfile(@Request() request): Promise<ProfileDto> {
    return await this.accountService.getMyProfile(request.user.email); // 사용자 Full 정보
  }
  /** Set Profile */
  @UseGuards(JwtAuthGuard)
  @Post('/settings/profile')
  async setMyProfile(@Request() request, @Body() body): Promise<ProfileDto> {
    await this.accountService.setMyProfile(request.user.email, body);
    return await this.accountService.getMyProfile(request.user.email); // 사용자 Full 정보
  }

  /** JWT TEST */
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  test(@Request() req): string {
    console.log(req.user);
    return 'ok';
  }
}
