import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}
  async findByEmail(email: string): Promise<Account> {
    return await this.accountRepository.findOne({ email: email });
  }
  async findByStudentId(student_id: number): Promise<Account> {
    return await this.accountRepository.findOne({ studentId: student_id });
  }

  async join(account: JoinRequestDto) {
    const hashedPassword = await bcrypt.hash(account.password, 12);
    await this.accountRepository.save({
      email: account.email,
      password: `{bcrypt}${hashedPassword}`, // {bcrypt}는 Spring Server와 데이터베이스 통합을 위한 전처리
      name: account.name,
      birth: account.birth,
      studentId: account.student_id,
      sex: account.sex,
      phone: account.phone,
    });
  }
}
