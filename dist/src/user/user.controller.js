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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const join_dto_1 = require("./dto/join.dto");
const responst_dto_will_delete_1 = require("./dto/responst.dto.will.delete");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async login(account) {
        await this.userService.findByEmail(account.email).then((account) => {
            if (account) {
                throw new common_1.HttpException({
                    error: 'Bad Request',
                    message: ['이미 가입되어있는 이메일입니다.'],
                }, 400);
            }
        });
        await this.userService
            .findByStudentId(account.student_id)
            .then((account) => {
            if (account) {
                throw new common_1.HttpException({
                    error: 'Bad Request',
                    message: ['이미 가입되어있는 학번입니다.'],
                }, 400);
            }
        });
        return await this.userService
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
};
__decorate([
    common_1.Post('/join'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_dto_1.JoinRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
UserController = __decorate([
    common_1.Controller('/'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=account.controller.js.map