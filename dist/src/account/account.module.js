"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const account_controller_1 = require("./account.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Account_1 = require("../entities/Account");
const Notification_1 = require("../entities/Notification");
const tag_module_1 = require("../tag/tag.module");
const auth_module_1 = require("../auth/auth.module");
let AccountModule = class AccountModule {
};
AccountModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Account_1.Account, Notification_1.Notification]),
            tag_module_1.TagModule,
            auth_module_1.AuthModule,
        ],
        providers: [account_service_1.AccountService],
        controllers: [account_controller_1.AccountController],
        exports: [account_service_1.AccountService],
    })
], AccountModule);
exports.AccountModule = AccountModule;
//# sourceMappingURL=account.module.js.map