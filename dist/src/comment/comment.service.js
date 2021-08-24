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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Comment_1 = require("../entities/Comment");
let CommentService = class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async setComment(account, post, content) {
        await this.commentRepository.save({
            account: account,
            post: post,
            content: content,
        });
    }
    async checkAccount(account, commentId) {
        const comment = await this.commentRepository
            .createQueryBuilder('comment')
            .select()
            .whereInIds(commentId)
            .innerJoinAndSelect('comment.account', 'account')
            .getOne();
        if (!comment)
            throw new common_1.BadRequestException();
        return account.id == comment.account.id;
    }
    async updateComment(commentId, content) {
        await this.commentRepository
            .createQueryBuilder()
            .update({ content: content })
            .whereInIds(commentId)
            .execute();
    }
    async deleteComment(commentId) {
        await this.commentRepository
            .createQueryBuilder()
            .delete()
            .whereInIds(commentId)
            .execute()
            .catch(() => {
            throw new common_1.BadRequestException();
        });
    }
};
CommentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Comment_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map