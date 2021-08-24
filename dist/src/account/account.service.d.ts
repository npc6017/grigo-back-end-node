import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.dto';
import { AccountTag } from '../entities/AccountTag';
import { ProfileDto } from './dto/profile.dto';
import { Notification } from '../entities/Notification';
import { NotificationDto } from './dto/notification.dto';
export declare class AccountService {
    private accountRepository;
    private notificationRepository;
    constructor(accountRepository: Repository<Account>, notificationRepository: Repository<Notification>);
    findByEmail(email: string): Promise<Account>;
    findByStudentId(student_id: number): Promise<Account>;
    tagToString(tagObjs: AccountTag[]): string[];
    profileDtoMapper(account: Account, stringTags: string[]): ProfileDto;
    setAccountCheckNotice(accountIds: number[]): Promise<void>;
    setAccountCheckNoticeToFalse(accountIds: number): Promise<void>;
    join(account: JoinRequestDto): Promise<void>;
    getMyProfile(email: any): Promise<ProfileDto>;
    setMyProfile(account: Account, body: any): Promise<void>;
    getMyNotification(account: Account): Promise<NotificationDto[]>;
    readNotification(account: Account, postId: number): Promise<void>;
    checkCurPassword(password: string, currentPassword: string): Promise<boolean>;
    updatePassword(account: Account, newPassword: string): Promise<void>;
}
