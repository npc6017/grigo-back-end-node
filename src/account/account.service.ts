import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}
  async findByEmail(email: string): Promise<Account> {
    // return await this.accountRepository.findOne({ email: email });
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

  async login(email): Promise<{
    checkNotice: boolean;
    phone: string;
    sex: string;
    name: string;
    student_id: number;
    birth: string;
    email: string;
    tags: string[];
  }> {
    const stringTags: string[] = [];
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .where('account.email =:email', { email: email })
      .select([
        'account.email',
        'account.name',
        'account.studentId',
        'account.phone',
        'account.birth',
        'account.sex',
        'account.checkNotice',
      ])
      .leftJoinAndSelect('account.accountTags', 'accountTags')
      .leftJoinAndSelect('accountTags.tag', 'tags')
      .getOne();
    account.accountTags.map((tag) => {
      stringTags.push(tag.tag.name);
    });
    const result = {
      /** 기존 응답 데이터 형식을 이상하게 잡아서.. 나중에 맵퍼로 빼야지 */
      email: account.email,
      name: account.name,
      student_id: account.studentId,
      phone: account.phone,
      birth: account.birth,
      sex: account.sex,
      checkNotice: account.checkNotice,
      tags: stringTags,
    };
    return result;
  }

  async setAccountCheckNotice(accountIds: number[]) {
    await this.accountRepository
      .createQueryBuilder()
      .update({ checkNotice: true })
      .whereInIds(accountIds)
      .execute();
  }
}
