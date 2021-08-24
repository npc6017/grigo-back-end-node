import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
export declare class CommentService {
    private commentRepository;
    constructor(commentRepository: Repository<Comment>);
    setComment(account: Account, post: Post, content: string): Promise<void>;
    checkAccount(account: Account, commentId: number): Promise<boolean>;
    updateComment(commentId: number, content: string): Promise<void>;
    deleteComment(commentId: number): Promise<void>;
}
