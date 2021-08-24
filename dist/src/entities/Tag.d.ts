import { AccountTag } from './AccountTag';
import { PostTag } from './PostTag';
export declare class Tag {
    id: number;
    name: string;
    category: string | null;
    accountTags: AccountTag[];
    postTags: PostTag[];
}
