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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Post_1 = require("../entities/Post");
const typeorm_2 = require("typeorm");
const tag_service_1 = require("../tag/tag.service");
const PostTag_1 = require("../entities/PostTag");
const account_service_1 = require("../account/account.service");
const Tag_1 = require("../entities/Tag");
const response_post_dto_1 = require("./dto/response.post.dto");
const Notification_1 = require("../entities/Notification");
let PostService = class PostService {
    constructor(tagService, accountService, postRepository, postTagRepository, tagRepository, notificationRepository) {
        this.tagService = tagService;
        this.accountService = accountService;
        this.postRepository = postRepository;
        this.postTagRepository = postTagRepository;
        this.tagRepository = tagRepository;
        this.notificationRepository = notificationRepository;
    }
    async findByPostId(postId) {
        return await this.postRepository
            .createQueryBuilder()
            .whereInIds(postId)
            .getOne();
    }
    async createPost(email, post) {
        const account = await this.accountService.findByEmail(email);
        const newPost = await this.postRepository.save({
            title: post.title,
            content: post.content,
            boardType: post.boardType,
            account,
        });
        const tagObjs = await this.tagService.getTagObject(post.tags);
        tagObjs.map((tag) => {
            this.postTagRepository.save(new PostTag_1.PostTag(newPost, tag)).catch((error) => {
                console.error(error);
            });
        });
        const accounts = await Promise.all(tagObjs.map(async (tag) => {
            const { accountTags: ac } = await this.tagRepository.findOne({
                where: tag,
                relations: ['accountTags', 'accountTags.account'],
            });
            return ac;
        }));
        const accountIds = [];
        accounts.map((ac) => {
            ac.map((a) => {
                if (!accountIds.includes(a.account.id)) {
                    this.notificationRepository.save({ account: a.account, post: newPost });
                    accountIds.push(a.account.id);
                }
            });
        });
        await this.accountService.setAccountCheckNotice(accountIds);
    }
    async getMyPost(email, postId) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: [
                'account',
                'postTags',
                'postTags.tag',
                'comments',
                'comments.account',
            ],
        });
        return this.postToResponsePostDTO(post, email);
    }
    async getMyPosts(email, query) {
        const posts = await this.postRepository.find({
            skip: query.id == 0 ? 0 : query.id - 1,
            take: query.size,
            where: { boardType: query.type },
            relations: [
                'account',
                'postTags',
                'postTags.tag',
                'comments',
                'comments.account',
            ],
            order: { id: 'DESC' },
        });
        const postDTOS = await Promise.all(posts.map((post) => this.postToResponsePostDTO(post, email)));
        return { postDTOS: postDTOS, hasNext: postDTOS.length != 0 };
    }
    postToResponsePostDTO(post, email) {
        const { id, title, account, content, boardType, postTags, comments, timeStamp, } = post;
        const tags = postTags.map((tag) => tag.tag.name);
        const commentDTOS = comments.map((comment) => {
            return {
                id: comment.id,
                content: comment.content,
                timeStamp: comment.timeStamp,
                userCheck: email == comment.account.email ? true : false,
            };
        });
        return new response_post_dto_1.ResponsePostDTO(id, title, account.name, content, boardType, tags, commentDTOS, timeStamp, email == account.email ? true : false);
    }
    async checkIsMine(email) {
        const account = await this.accountService.findByEmail(email);
        const isCheck = await this.postRepository.findOne({
            where: { account },
        });
        return isCheck ? true : false;
    }
    async update(postId, updatePost) {
        const post = await this.postRepository
            .createQueryBuilder()
            .update({ title: updatePost.title, content: updatePost.content, boardType: updatePost.boardType, })
            .whereInIds(postId)
            .returning('*')
            .execute()
            .then((res) => res.raw[0]);
        if (updatePost.addTags) {
            const newPostTag = [];
            const tagObjs = await this.tagService.getTagObject(updatePost.addTags);
            await Promise.all(tagObjs.map(async (tag) => {
                const exTag = await this.postTagRepository.findOne({
                    where: { post, tag },
                });
                if (!exTag)
                    newPostTag.push(this.postTagRepository.create(new PostTag_1.PostTag(post, tag)));
            }));
            await this.postTagRepository.save(newPostTag);
        }
        if (updatePost.deletedTags) {
            const tagObjs = await this.tagService.getTagObject(updatePost.deletedTags);
            tagObjs.map((tag) => {
                this.postTagRepository.delete({
                    post: post,
                    tag: tag,
                });
            });
        }
    }
    async deletePost(postId) {
        await this.postRepository
            .createQueryBuilder()
            .delete()
            .whereInIds(postId)
            .execute();
    }
};
PostService = __decorate([
    common_1.Injectable(),
    __param(2, typeorm_1.InjectRepository(Post_1.Post)),
    __param(3, typeorm_1.InjectRepository(PostTag_1.PostTag)),
    __param(4, typeorm_1.InjectRepository(Tag_1.Tag)),
    __param(5, typeorm_1.InjectRepository(Notification_1.Notification)),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        account_service_1.AccountService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map