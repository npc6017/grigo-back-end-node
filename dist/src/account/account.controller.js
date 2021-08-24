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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const join_dto_1 = require("./dto/join.dto");
const responst_dto_will_delete_1 = require("./dto/responst.dto.will.delete");
const local_auth_guard_1 = require("../auth/local-auth.guard");
const auth_service_1 = require("../auth/auth.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tag_service_1 = require("../tag/tag.service");
let AccountController = class AccountController {
    constructor(accountService, authService, tagService) {
        this.accountService = accountService;
        this.authService = authService;
        this.tagService = tagService;
    }
    async join(account) {
        await this.accountService.findByEmail(account.email).then((account) => {
            if (account) {
                throw new common_1.HttpException({
                    error: 'Bad Request',
                    message: ['이미 가입되어있는 이메일입니다.'],
                }, 400);
            }
        });
        await this.accountService
            .findByStudentId(account.student_id)
            .then((account) => {
            if (account) {
                throw new common_1.HttpException({
                    error: 'Bad Request',
                    message: ['이미 가입되어있는 학번입니다.'],
                }, 400);
            }
        });
        return await this.accountService
            .join(account)
            .then(() => {
            return new responst_dto_will_delete_1.ResponseDTO(200, '회원가입을 축하합니다!');
        })
            .catch((err) => {
            console.error(err);
            throw new common_1.HttpException({
                error: 'Bad Request',
                message: ['서버에서 문제가 발생하였습니다.'],
            }, 400);
        });
    }
    async login(req, res, email) {
        const token = await this.authService.login(email);
        const account = await this.accountService.getMyProfile(email);
        res.setHeader('authorization', token);
        if (account.tags.length == 0) {
            res.status(214);
            return res.json(account);
        }
        res.status(213);
        return res.json(account);
    }
    async getMyProfile(request) {
        return await this.accountService.getMyProfile(request.user.email);
    }
    async setMyProfile(request, body) {
        const account = await this.accountService.findByEmail(request.user.email);
        await this.accountService.setMyProfile(account, body);
        await this.tagService.setMyTags(body.addTags, account);
        const deleteTagObjs = await this.tagService.getTagObject(body.deletedTags);
        await this.tagService.deleteAccountTags(deleteTagObjs, account);
        return await this.accountService.getMyProfile(request.user.email);
    }
    async updateMyPassword(req, body) {
        const account = await this.accountService.findByEmail(req.user.email);
        const isCurCheck = await this.accountService.checkCurPassword(account.password, body.currentPassword);
        if (!isCurCheck)
            return new responst_dto_will_delete_1.ResponseDTO(400, '비밀번호가 일치하지 않습니다.');
        const isNewCheck = body.newPassword == body.newPasswordConfirm;
        if (!isNewCheck)
            return new responst_dto_will_delete_1.ResponseDTO(400, '새로운 비밀번호가 일치하지 않습니다.');
        await this.accountService.updatePassword(account, body.newPassword);
        return new responst_dto_will_delete_1.ResponseDTO(200, '비밀번호가 성공적으로 변경되었습니다.');
    }
    async getMyNotification(request) {
        const account = await this.accountService.findByEmail(request.user.email);
        return await this.accountService.getMyNotification(account);
    }
    async readNotification(request, postId) {
        const account = await this.accountService.findByEmail(request.user.email);
        await this.accountService.readNotification(account, postId);
    }
    test(req) {
        console.log(req.user);
        return 'ok';
    }
};
__decorate([
    common_1.Post('/join'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_dto_1.JoinRequestDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "join", null);
__decorate([
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('/login'),
    __param(0, common_1.Request()),
    __param(1, common_1.Response()),
    __param(2, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/profile'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getMyProfile", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/settings/profile'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "setMyProfile", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/settings/password'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateMyPassword", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/notification'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getMyNotification", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/notification/:postId'),
    __param(0, common_1.Request()),
    __param(1, common_1.Param('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "readNotification", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/test'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], AccountController.prototype, "test", null);
AccountController = __decorate([
    common_1.Controller('/'),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        auth_service_1.AuthService,
        tag_service_1.TagService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map