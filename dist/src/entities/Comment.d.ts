import { Account } from './Account';
import { Post } from './Post';
export declare class Comment {
    id: number;
    content: string;
    timeStamp: Date;
    account: Account;
    post: Post;
}
