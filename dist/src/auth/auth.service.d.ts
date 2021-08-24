import { AccountService } from '../account/account.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private accountService;
    private jwtService;
    constructor(accountService: AccountService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: number;
        email: string;
        name: string;
        studentId: number;
        phone: string;
        birth: string;
        sex: string;
        checkNotice: boolean;
        accountTags: import("../entities/AccountTag").AccountTag[];
        comments: import("../entities/Comment").Comment[];
        notifications: import("../entities/Notification").Notification[];
        posts: import("../entities/Post").Post[];
    }>;
    login(email: string): Promise<string>;
}
