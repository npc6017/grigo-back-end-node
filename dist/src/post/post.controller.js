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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const request_post_dto_1 = require("./dto/request.post.dto");
const post_service_1 = require("./post.service");
const update_post_dto_1 = require("./dto/update.post.dto");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    async setMyPost(req, post) {
        await this.postService.createPost(req.user.email, post);
        return 'post save successful';
    }
    async getPosts(req, query) {
        return await this.postService.getMyPosts(req.user.email, query);
    }
    async getPost(req, postId) {
        return await this.postService.getMyPost(req.user.email, postId);
    }
    async updatePost(request, postId, updatePost) {
        const isCheck = await this.postService.checkIsMine(request.user.email);
        if (!isCheck)
            throw new common_1.ForbiddenException();
        await this.postService.update(postId, updatePost);
        return 'post update successful';
    }
    async deletePost(request, postId) {
        const isCheck = await this.postService.checkIsMine(request.user.email);
        if (!isCheck)
            throw new common_1.ForbiddenException();
        await this.postService.deletePost(postId);
        return 'post delete successful';
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/save'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_post_dto_1.RequestPostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "setMyPost", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/board'),
    __param(0, common_1.Request()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/:postId'),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPost", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/:postId/update'),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('postId')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/:postId/delete'),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
PostController = __decorate([
    common_1.Controller('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map