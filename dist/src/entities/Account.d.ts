import { AccountTag } from './AccountTag';
import { Comment } from './Comment';
import { Notification } from './Notification';
import { Post } from './Post';
export declare class Account {
    id: number;
    email: string;
    password: string;
    name: string;
    studentId: number;
    phone: string | null;
    birth: string | null;
    sex: string | null;
    checkNotice: boolean | null;
    accountTags: AccountTag[];
    comments: Comment[];
    notifications: Notification[];
    posts: Post[];
}
