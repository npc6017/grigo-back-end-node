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
exports.Tag = void 0;
const typeorm_1 = require("typeorm");
const AccountTag_1 = require("./AccountTag");
const PostTag_1 = require("./PostTag");
let Tag = class Tag {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], Tag.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'name', unique: true, length: 30 }),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('character varying', { name: 'category', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Tag.prototype, "category", void 0);
__decorate([
    typeorm_1.OneToMany(() => AccountTag_1.AccountTag, (accountTag) => accountTag.tag),
    __metadata("design:type", Array)
], Tag.prototype, "accountTags", void 0);
__decorate([
    typeorm_1.OneToMany(() => PostTag_1.PostTag, (postTag) => postTag.tag),
    __metadata("design:type", Array)
], Tag.prototype, "postTags", void 0);
Tag = __decorate([
    typeorm_1.Index('tag_pkey', ['id'], { unique: true }),
    typeorm_1.Index('tag_name_key', ['name'], { unique: true }),
    typeorm_1.Entity('tag', { schema: 'public' })
], Tag);
exports.Tag = Tag;
//# sourceMappingURL=Tag.js.map