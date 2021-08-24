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
exports.TagController = void 0;
const common_1 = require("@nestjs/common");
const tag_service_1 = require("./tag.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const account_service_1 = require("../account/account.service");
let TagController = class TagController {
    constructor(tagService, accountService) {
        this.tagService = tagService;
        this.accountService = accountService;
    }
    async setMyTags(req, tags) {
        const account = await this.accountService.findByEmail(req.user.email);
        await this.tagService.setMyTags(tags, account);
    }
    async getMyTags(req) {
        return await this.tagService.getMyTags(req.user.email);
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('/setting'),
    __param(0, common_1.Request()),
    __param(1, common_1.Body('tags')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "setMyTags", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('/setting'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getMyTags", null);
TagController = __decorate([
    common_1.Controller('tag'),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        account_service_1.AccountService])
], TagController);
exports.TagController = TagController;
//# sourceMappingURL=tag.controller.js.map