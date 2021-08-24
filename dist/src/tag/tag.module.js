"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModule = void 0;
const common_1 = require("@nestjs/common");
const tag_service_1 = require("./tag.service");
const tag_controller_1 = require("./tag.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Account_1 = require("../entities/Account");
const AccountTag_1 = require("../entities/AccountTag");
const Tag_1 = require("../entities/Tag");
const account_module_1 = require("../account/account.module");
let TagModule = class TagModule {
};
TagModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([AccountTag_1.AccountTag, Tag_1.Tag, Account_1.Account]),
            common_1.forwardRef(() => account_module_1.AccountModule),
        ],
        providers: [tag_service_1.TagService],
        controllers: [tag_controller_1.TagController],
        exports: [tag_service_1.TagService],
    })
], TagModule);
exports.TagModule = TagModule;
//# sourceMappingURL=tag.module.js.map