import { AccountService } from './account.service';
import { JoinRequestDto } from './dto/join.dto';
import { ResponseDTO } from './dto/responst.dto.will.delete';
import { AuthService } from '../auth/auth.service';
import { ProfileDto } from './dto/profile.dto';
import { TagService } from '../tag/tag.service';
import { NotificationDto } from './dto/notification.dto';
export declare class AccountController {
    private accountService;
    private authService;
    private tagService;
    constructor(accountService: AccountService, authService: AuthService, tagService: TagService);
    join(account: JoinRequestDto): Promise<string | ResponseDTO>;
    login(req: any, res: any, email: any): Promise<string>;
    getMyProfile(request: any): Promise<ProfileDto>;
    setMyProfile(request: any, body: any): Promise<ProfileDto>;
    updateMyPassword(req: any, body: any): Promise<ResponseDTO>;
    getMyNotification(request: any): Promise<NotificationDto[]>;
    readNotification(request: any, postId: number): Promise<void>;
    test(req: any): string;
}
