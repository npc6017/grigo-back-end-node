"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("./src/entities/Account");
const AccountTag_1 = require("./src/entities/AccountTag");
const Comment_1 = require("./src/entities/Comment");
const Notification_1 = require("./src/entities/Notification");
const Post_1 = require("./src/entities/Post");
const PostTag_1 = require("./src/entities/PostTag");
const Tag_1 = require("./src/entities/Tag");
const dotenv = require("dotenv");
dotenv.config();
const config = {
    type: 'postgres',
    host: process.env.HOST,
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [Account_1.Account, AccountTag_1.AccountTag, Comment_1.Comment, Notification_1.Notification, Post_1.Post, PostTag_1.PostTag, Tag_1.Tag],
    synchronize: true,
};
module.exports = config;
//# sourceMappingURL=ormconfig.js.map