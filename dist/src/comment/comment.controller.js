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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const post_service_1 = require("../post/post.service");
const account_service_1 = require("../account/account.service");
let CommentController = class CommentController {
    constructor(commentService, postService, accountService) {
        this.commentService = commentService;
        this.postService = postService;
        this.accountService = accountService;
    }
    async setComment(req, content, postId) {
        const post = await this.postService.findByPostId(postId);
        if (!post)
            throw new common_1.BadRequestException();
        const account = await this.accountService.findByEmail(req.user.email);
        await this.commentService.setComment(account, post, content);
        return '댓글이 성공적으로 작성되었습니다.';
    }
    async updateComment(req, content, commentId) {
        const account = await this.accountService.findByEmail(req.user.email);
        const isCheck = await this.commentService.checkAccount(account, commentId);
        if (!isCheck)
            throw new common_1.ForbiddenException();
        await this.commentService.updateComment(commentId, content);
        return '댓글이 성공적으로 수정되었습니다.';
    }
    async deleteComment(req, commentId) {
        const account = await this.accountService.findByEmail(req.user.email);
        const isCheck = await this.commentService.checkAccount(account, commentId);
        if (!isCheck)
            throw new common_1.ForbiddenException();
        await this.commentService.deleteComment(commentId);
        return '댓글이 정상적으로 삭제되었습니다.';
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/:postId/comment'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body('content')),
    __param(2, common_1.Param('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "setComment", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/comment/change/:commentId'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body('content')),
    __param(2, common_1.Param('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateComment", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('comment/:commentId'),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
CommentController = __decorate([
    common_1.Controller(''),
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        post_service_1.PostService,
        account_service_1.AccountService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map