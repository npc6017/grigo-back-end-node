"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModule = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const post_controller_1 = require("./post.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Tag_1 = require("../entities/Tag");
const Post_1 = require("../entities/Post");
const PostTag_1 = require("../entities/PostTag");
const Notification_1 = require("../entities/Notification");
const account_module_1 = require("../account/account.module");
const tag_module_1 = require("../tag/tag.module");
let PostModule = class PostModule {
};
PostModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Post_1.Post, Tag_1.Tag, PostTag_1.PostTag, Notification_1.Notification]),
            account_module_1.AccountModule,
            tag_module_1.TagModule,
        ],
        providers: [post_service_1.PostService],
        controllers: [post_controller_1.PostController],
        exports: [post_service_1.PostService],
    })
], PostModule);
exports.PostModule = PostModule;
//# sourceMappingURL=post.module.js.map