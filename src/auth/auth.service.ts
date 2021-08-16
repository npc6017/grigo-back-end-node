import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  /** 로그인 요청 사용자 검증  */
  async validateUser(email: string, password: string) {
    const account = await this.accountService.findByEmail(email);
    if (account) {
      const checkPassword = await bcrypt.compare(
        password,
        account.password.substr(8) /** {bcrypt} 제거 전처리 */,
      );
      if (checkPassword) {
        const { password, ...accountWithoutPassword } = account;
        return accountWithoutPassword;
      } else return null;
    }
    return null;
  }
  /** jwt토큰 발급 */
  async login(email: string) {
    const payload = { email: email, role: 'user' };

    return `bearer ${this.jwtService.sign(payload)}`;
  }
}
