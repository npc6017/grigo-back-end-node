import { Comment } from './Comment';
import { Notification } from './Notification';
import { Account } from './Account';
import { PostTag } from './PostTag';
export declare class Post {
    id: number;
    title: string;
    content: string;
    boardType: string;
    timeStamp: Date;
    comments: Comment[];
    notifications: Notification[];
    account: Account;
    postTags: PostTag[];
}
