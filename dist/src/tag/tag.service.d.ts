import { Tag } from '../entities/Tag';
import { Repository } from 'typeorm';
import { AccountTag } from '../entities/AccountTag';
import { Account } from '../entities/Account';
export declare class TagService {
    private accountRepository;
    private tagRepository;
    private accountTagRepository;
    constructor(accountRepository: Repository<Account>, tagRepository: Repository<Tag>, accountTagRepository: Repository<AccountTag>);
    getTagObject(tags: string[]): Promise<Tag[]>;
    getTagObjectByTagStrings(newTags: string[]): Promise<Tag[]>;
    setMyTags(tags: string[], account: Account): Promise<void>;
    getMyTags(email: any): Promise<string[]>;
    deleteAccountTags(deleteTagObjs: Tag[], account: Account): Promise<void>;
}
