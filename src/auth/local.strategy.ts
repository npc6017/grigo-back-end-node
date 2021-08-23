import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
    /** { username: ?, passwordField: ? } 아래 validate와 매칭되기 위한 설정
     * 입력받는 id가 email이면 여기서 커스텀이 필요하다. */
  }

  async validate(email: string, password: string): Promise<any> {
    const account = this.authService.validateUser(email, password);

    if (!account) throw new UnauthorizedException();
    return account;
  }
}
