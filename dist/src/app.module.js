"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const account_module_1 = require("./account/account.module");
const typeorm_1 = require("@nestjs/typeorm");
const ormconfig = require("../ormconfig");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const tag_module_1 = require("./tag/tag.module");
const post_module_1 = require("./post/post.module");
const comment_module_1 = require("./comment/comment.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            account_module_1.AccountModule,
            typeorm_1.TypeOrmModule.forRoot(ormconfig),
            config_1.ConfigModule.forRoot(),
            auth_module_1.AuthModule,
            tag_module_1.TagModule,
            post_module_1.PostModule,
            comment_module_1.CommentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map