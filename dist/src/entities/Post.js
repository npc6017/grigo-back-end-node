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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const Comment_1 = require("./Comment");
const Notification_1 = require("./Notification");
const Account_1 = require("./Account");
const PostTag_1 = require("./PostTag");
let Post = class Post {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'title', length: 100 }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    typeorm_1.Column('text', { name: 'content' }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'boardType', length: 20 }),
    __metadata("design:type", String)
], Post.prototype, "boardType", void 0);
__decorate([
    typeorm_1.Column('timestamp with time zone', {
        name: 'time_stamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Post.prototype, "timeStamp", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, (comment) => comment.post),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    typeorm_1.OneToMany(() => Notification_1.Notification, (notification) => notification.post),
    __metadata("design:type", Array)
], Post.prototype, "notifications", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Account_1.Account, (account) => account.posts, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Account_1.Account)
], Post.prototype, "account", void 0);
__decorate([
    typeorm_1.OneToMany(() => PostTag_1.PostTag, (postTag) => postTag.post),
    __metadata("design:type", Array)
], Post.prototype, "postTags", void 0);
Post = __decorate([
    typeorm_1.Index('post_pkey', ['id'], { unique: true }),
    typeorm_1.Entity('post', { schema: 'public' })
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map