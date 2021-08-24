import { Account } from './Account';
import { Tag } from './Tag';
export declare class AccountTag {
    constructor(account: Account, tag: Tag);
    id: number;
    account: Account;
    tag: Tag;
}
