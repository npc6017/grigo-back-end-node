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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Post_1 = require("./Post");
let Notification = class Notification {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Account_1.Account, (account) => account.notifications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Account_1.Account)
], Notification.prototype, "account", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Post_1.Post, (post) => post.notifications, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Post_1.Post)
], Notification.prototype, "post", void 0);
Notification = __decorate([
    typeorm_1.Index('notification_pkey', ['id'], { unique: true }),
    typeorm_1.Index('account_post_composite_pkey', ['account', 'post'], { unique: true }),
    typeorm_1.Entity('notification', { schema: 'public' })
], Notification);
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map