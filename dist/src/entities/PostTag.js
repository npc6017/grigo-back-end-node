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
exports.PostTag = void 0;
const typeorm_1 = require("typeorm");
const Post_1 = require("./Post");
const Tag_1 = require("./Tag");
let PostTag = class PostTag {
    constructor(newPost, tag) {
        this.post = newPost,
            this.tag = tag;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], PostTag.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Post_1.Post, (post) => post.postTags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Post_1.Post)
], PostTag.prototype, "post", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Tag_1.Tag, (tag) => tag.postTags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Tag_1.Tag)
], PostTag.prototype, "tag", void 0);
PostTag = __decorate([
    typeorm_1.Index('post_tag_pkey', ['id'], { unique: true }),
    typeorm_1.Index('post_tag_composite_pkey', ['post', 'tag'], { unique: true }),
    typeorm_1.Entity('post_tag', { schema: 'public' }),
    __metadata("design:paramtypes", [Post_1.Post, Tag_1.Tag])
], PostTag);
exports.PostTag = PostTag;
//# sourceMappingURL=PostTag.js.map