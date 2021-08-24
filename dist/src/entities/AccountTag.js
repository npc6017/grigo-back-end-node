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
exports.AccountTag = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Tag_1 = require("./Tag");
let AccountTag = class AccountTag {
    constructor(account, tag) {
        this.account = account;
        this.tag = tag;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], AccountTag.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Account_1.Account, (account) => account.accountTags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Account_1.Account)
], AccountTag.prototype, "account", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Tag_1.Tag, (tag) => tag.accountTags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Tag_1.Tag)
], AccountTag.prototype, "tag", void 0);
AccountTag = __decorate([
    typeorm_1.Index('account_tag_pkey', ['id'], { unique: true }),
    typeorm_1.Index('account_tag_composite_pkey', ['account', 'tag'], { unique: true }),
    typeorm_1.Entity('account_tag', { schema: 'public' }),
    __metadata("design:paramtypes", [Account_1.Account, Tag_1.Tag])
], AccountTag);
exports.AccountTag = AccountTag;
//# sourceMappingURL=AccountTag.js.map