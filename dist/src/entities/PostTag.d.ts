import { Post } from './Post';
import { Tag } from './Tag';
export declare class PostTag {
    constructor(newPost: Post, tag: Tag);
    id: number;
    post: Post;
    tag: Tag;
}
