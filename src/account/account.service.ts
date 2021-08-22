import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.dto';
import * as bcrypt from 'bcrypt';
import { AccountTag } from '../entities/AccountTag';
import { ProfileDto } from './dto/profile.dto';
import { TagService } from '../tag/tag.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private tagService: TagService,
  ) {}
  async findByEmail(email: string): Promise<Account> {
    // return await this.accountRepository.findOne({ email: email });
    return await this.accountRepository.findOne({ email: email });
  }
  async findByStudentId(student_id: number): Promise<Account> {
    return await this.accountRepository.findOne({ studentId: student_id });
  }
  /** TagObject To String[] **/
  tagToString(tagObjs: AccountTag[]): string[] {
    const stringTags: string[] = [];
    tagObjs.map((tag) => {
      stringTags.push(tag.tag.name);
    });
    return stringTags;
  }
  /** Profile DTO Mapper **/
  profileDtoMapper(account: Account, stringTags: string[]): ProfileDto {
    return new ProfileDto( account.email, account.name, account.studentId, account.phone, account.birth, account.sex, stringTags);
  }
  /** Join */
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
  /** Login */
  async getMyProfile(email): Promise<ProfileDto> {
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
    const stringTags: string[] = this.tagToString(account.accountTags);
    const result = this.profileDtoMapper(account, stringTags);
    return result;
  }
  /** Set Check Notice true */
  async setAccountCheckNotice(accountIds: number[]) {
    await this.accountRepository
      .createQueryBuilder()
      .update({ checkNotice: true })
      .whereInIds(accountIds)
      .execute();
  }
  /** Set My Profile */
  async setMyProfile(email, body): Promise<void> {
    const account = await this.findByEmail(email);
    /// Add Tags
    await this.tagService.setMyTags(body.addTags, account);
    // Delete Tags
    const deleteTagObjs = await this.tagService.getTagObject(body.deletedTags);
    await this.tagService.deleteAccountTags(deleteTagObjs, account);
    // Set Phone, Birth
    account.birth = body.birth;
    account.phone = body.phone;
    await this.accountRepository.save(account);
  }
}
