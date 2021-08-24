import { TagService } from './tag.service';
import { AccountService } from '../account/account.service';
export declare class TagController {
    private tagService;
    private accountService;
    constructor(tagService: TagService, accountService: AccountService);
    setMyTags(req: any, tags: string[]): Promise<void>;
    getMyTags(req: any): Promise<string[]>;
}
