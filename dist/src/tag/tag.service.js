"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Tag_1 = require("../entities/Tag");
const typeorm_2 = require("typeorm");
const AccountTag_1 = require("../entities/AccountTag");
const Account_1 = require("../entities/Account");
let TagService = class TagService {
    constructor(accountRepository, tagRepository, accountTagRepository) {
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
        this.accountTagRepository = accountTagRepository;
    }
    async getTagObject(tags) {
        const tagObjs = [];
        await Promise.all(tags.map(async (tag) => {
            const isTag = await this.tagRepository.findOne({ name: tag });
            if (isTag)
                tagObjs.push(isTag);
        }));
        return tagObjs;
    }
    async getTagObjectByTagStrings(newTags) {
        return await this.tagRepository
            .createQueryBuilder()
            .select()
            .where(newTags)
            .getMany();
    }
    async setMyTags(tags, account) {
        const newTags = [];
        const newAccountTags = [];
        await Promise.all(tags.map(async (tag) => {
            const exTag = await this.tagRepository.findOne({
                where: { name: tag },
            });
            if (!exTag)
                newTags.push(this.tagRepository.create({ name: tag }));
            return null;
        }));
        await this.tagRepository.save(newTags);
        const tagObj = await this.getTagObject(tags);
        await Promise.all(tagObj.map(async (tag) => {
            const exTag = await this.accountTagRepository.findOne({
                where: { account, tag },
            });
            if (!exTag)
                newAccountTags.push(this.accountTagRepository.create(new AccountTag_1.AccountTag(account, tag)));
            return null;
        }));
        await this.accountTagRepository.save(newAccountTags);
    }
    async getMyTags(email) {
        const stringTags = [];
        const myTags = await this.accountRepository
            .createQueryBuilder('account')
            .where('account.email =:email', { email: email })
            .innerJoinAndSelect('account.accountTags', 'accountTags')
            .innerJoinAndSelect('accountTags.tag', 'tags')
            .getOne();
        myTags.accountTags.map((tag) => {
            stringTags.push(tag.tag.name);
        });
        return stringTags;
    }
    async deleteAccountTags(deleteTagObjs, account) {
        await Promise.all(deleteTagObjs.map(async (tag) => {
            await this.accountTagRepository.delete({
                account: account,
                tag: tag,
            });
        }));
    }
};
TagService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Account_1.Account)),
    __param(1, typeorm_1.InjectRepository(Tag_1.Tag)),
    __param(2, typeorm_1.InjectRepository(AccountTag_1.AccountTag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map