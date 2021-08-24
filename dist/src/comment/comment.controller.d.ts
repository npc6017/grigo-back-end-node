import { CommentService } from './comment.service';
import { PostService } from '../post/post.service';
import { AccountService } from '../account/account.service';
export declare class CommentController {
    private commentService;
    private postService;
    private accountService;
    constructor(commentService: CommentService, postService: PostService, accountService: AccountService);
    setComment(req: any, content: string, postId: number): Promise<string>;
    updateComment(req: any, content: string, commentId: number): Promise<string>;
    deleteComment(req: any, commentId: number): Promise<string>;
}
