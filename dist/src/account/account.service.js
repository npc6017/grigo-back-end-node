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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Account_1 = require("../entities/Account");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const profile_dto_1 = require("./dto/profile.dto");
const Notification_1 = require("../entities/Notification");
const notification_dto_1 = require("./dto/notification.dto");
let AccountService = class AccountService {
    constructor(accountRepository, notificationRepository) {
        this.accountRepository = accountRepository;
        this.notificationRepository = notificationRepository;
    }
    async findByEmail(email) {
        return await this.accountRepository.findOne({ email: email });
    }
    async findByStudentId(student_id) {
        return await this.accountRepository.findOne({ studentId: student_id });
    }
    tagToString(tagObjs) {
        const stringTags = [];
        tagObjs.map((tag) => {
            stringTags.push(tag.tag.name);
        });
        return stringTags;
    }
    profileDtoMapper(account, stringTags) {
        return new profile_dto_1.ProfileDto(account.email, account.name, account.studentId, account.phone, account.birth, account.sex, stringTags);
    }
    async setAccountCheckNotice(accountIds) {
        await this.accountRepository
            .createQueryBuilder()
            .update({ checkNotice: true })
            .whereInIds(accountIds)
            .execute();
    }
    async setAccountCheckNoticeToFalse(accountIds) {
        await this.accountRepository
            .createQueryBuilder()
            .update({ checkNotice: false })
            .whereInIds(accountIds)
            .execute();
    }
    async join(account) {
        const hashedPassword = await bcrypt.hash(account.password, 12);
        await this.accountRepository.save({
            email: account.email,
            password: `{bcrypt}${hashedPassword}`,
            name: account.name,
            birth: account.birth,
            studentId: account.student_id,
            sex: account.sex,
            phone: account.phone,
        });
    }
    async getMyProfile(email) {
        const account = await this.accountRepository
            .createQueryBuilder('account')
            .where('account.email =:email', { email: email })
            .select([
            'account.email',
            'account.name',
            'account.studentId',
            'account.phone',
            'account.birth',
            'account.sex',
            'account.checkNotice',
        ])
            .innerJoinAndSelect('account.accountTags', 'accountTags')
            .innerJoinAndSelect('accountTags.tag', 'tags')
            .getOne();
        const stringTags = this.tagToString(account.accountTags);
        const result = this.profileDtoMapper(account, stringTags);
        return result;
    }
    async setMyProfile(account, body) {
        account.birth = body.birth;
        account.phone = body.phone;
        await this.accountRepository.save(account);
    }
    async getMyNotification(account) {
        const notifications = await this.notificationRepository
            .createQueryBuilder('notification')
            .select()
            .where('notification.account_id =:id', { id: account.id })
            .innerJoinAndSelect('notification.post', 'post')
            .getMany();
        const result = notifications.map((notification) => new notification_dto_1.NotificationDto(notification.id, notification.post.id, notification.post.title));
        return result;
    }
    async readNotification(account, postId) {
        await this.notificationRepository
            .createQueryBuilder('notification')
            .delete()
            .where('notification.post_id =:postId and notification.account_id =:accountId', {
            postId: postId,
            accountId: account.id,
        })
            .execute();
        const count = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.account_id =:accountId', { accountId: account.id })
            .getCount();
        if (count == 0)
            await this.setAccountCheckNoticeToFalse(account.id);
    }
    async checkCurPassword(password, currentPassword) {
        return await bcrypt.compare(currentPassword, password.substr(8));
    }
    async updatePassword(account, newPassword) {
        const hashed = await bcrypt.hash(newPassword, 12);
        await this.accountRepository
            .createQueryBuilder()
            .update({ password: `{bcrypr}${hashed}` })
            .where(account)
            .execute();
    }
};
AccountService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Account_1.Account)),
    __param(1, typeorm_1.InjectRepository(Notification_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map