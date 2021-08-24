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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const AccountTag_1 = require("./AccountTag");
const Comment_1 = require("./Comment");
const Notification_1 = require("./Notification");
const Post_1 = require("./Post");
let Account = class Account {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'email', unique: true, length: 50 }),
    __metadata("design:type", String)
], Account.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'password', length: 100 }),
    __metadata("design:type", String)
], Account.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'name', length: 30 }),
    __metadata("design:type", String)
], Account.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('integer', { name: 'student_id', unique: true }),
    __metadata("design:type", Number)
], Account.prototype, "studentId", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'phone', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Account.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'birth', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Account.prototype, "birth", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'sex', nullable: true, length: 20 }),
    __metadata("design:type", String)
], Account.prototype, "sex", void 0);
__decorate([
    typeorm_1.Column('boolean', {
        name: 'check_notice',
        nullable: true,
        default: () => 'false',
    }),
    __metadata("design:type", Boolean)
], Account.prototype, "checkNotice", void 0);
__decorate([
    typeorm_1.OneToMany(() => AccountTag_1.AccountTag, (accountTag) => accountTag.account),
    __metadata("design:type", Array)
], Account.prototype, "accountTags", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, (comment) => comment.account),
    __metadata("design:type", Array)
], Account.prototype, "comments", void 0);
__decorate([
    typeorm_1.OneToMany(() => Notification_1.Notification, (notification) => notification.account),
    __metadata("design:type", Array)
], Account.prototype, "notifications", void 0);
__decorate([
    typeorm_1.OneToMany(() => Post_1.Post, (post) => post.account),
    __metadata("design:type", Array)
], Account.prototype, "posts", void 0);
Account = __decorate([
    typeorm_1.Index('account_email_key', ['email'], { unique: true }),
    typeorm_1.Index('account_pkey', ['id'], { unique: true }),
    typeorm_1.Index('account_student_id_key', ['studentId'], { unique: true }),
    typeorm_1.Entity('account', { schema: 'public' })
], Account);
exports.Account = Account;
//# sourceMappingURL=Account.js.map