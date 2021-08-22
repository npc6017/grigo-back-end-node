import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.dto';
import * as bcrypt from 'bcrypt';
import { AccountTag } from '../entities/AccountTag';
import { ProfileDto } from './dto/profile.dto';
import { Notification } from '../entities/Notification';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async findByEmail(email: string): Promise<Account> {
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
    return new ProfileDto(
      account.email,
      account.name,
      account.studentId,
      account.phone,
      account.birth,
      account.sex,
      stringTags,
    );
  }
  /** Set Check Notice true **/
  async setAccountCheckNotice(accountIds: number[]) {
    await this.accountRepository
      .createQueryBuilder()
      .update({ checkNotice: true })
      .whereInIds(accountIds)
      .execute();
  }
  /** Set Check Notice false **/
  async setAccountCheckNoticeToFalse(accountIds: number) {
    await this.accountRepository
      .createQueryBuilder()
      .update({ checkNotice: false })
      .whereInIds(accountIds)
      .execute();
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
  /** Set My Profile */
  async setMyProfile(account: Account, body): Promise<void> {
    // Set Phone, Birth
    account.birth = body.birth;
    account.phone = body.phone;
    await this.accountRepository.save(account);
  }

  /** Get My Notification */
  async getMyNotification(account: Account): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .select()
      .where('notification.account_id =:id', { id: account.id })
      .leftJoinAndSelect('notification.post', 'post')
      .getMany();
    const result = notifications.map(
      (notification) =>
        new NotificationDto(
          notification.id,
          notification.post.id,
          notification.post.title,
        ),
    );
    return result;
  }

  /** Read Notification */
  async readNotification(account: Account, postId: number): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder('notification')
      .delete()
      .where(
        'notification.post_id =:postId and notification.account_id =:accountId',
        {
          postId: postId,
          accountId: account.id,
        },
      )
      .execute();
    const count = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.account_id =:accountId', { accountId: account.id })
      .getCount();
    if (count == 0) await this.setAccountCheckNoticeToFalse(account.id);
  }
  /** Compare Password */
  async checkCurPassword( password: string, currentPassword: string): Promise<boolean> {
    return await bcrypt.compare(currentPassword, password.substr(8));
  }
  /** Update Password */
  async updatePassword(account: Account, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.accountRepository
      .createQueryBuilder()
      .update({ password: `{bcrypr}${hashed}` })
      .where(account)
      .execute();
  }
}
