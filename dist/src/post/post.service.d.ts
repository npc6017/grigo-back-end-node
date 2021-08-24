import { RequestPostDto } from './dto/request.post.dto';
import { Post } from '../entities/Post';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { PostTag } from '../entities/PostTag';
import { AccountService } from '../account/account.service';
import { Tag } from '../entities/Tag';
import { ResponsePostDTO } from './dto/response.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import { Notification } from '../entities/Notification';
export declare class PostService {
    private tagService;
    private accountService;
    private postRepository;
    private postTagRepository;
    private tagRepository;
    private notificationRepository;
    constructor(tagService: TagService, accountService: AccountService, postRepository: Repository<Post>, postTagRepository: Repository<PostTag>, tagRepository: Repository<Tag>, notificationRepository: Repository<Notification>);
    findByPostId(postId: number): Promise<Post>;
    createPost(email: string, post: RequestPostDto): Promise<void>;
    getMyPost(email: string, postId: number): Promise<ResponsePostDTO>;
    getMyPosts(email: string, query: any): Promise<{
        postDTOS: ResponsePostDTO[];
        hasNext: boolean;
    }>;
    postToResponsePostDTO(post: Post, email: string): ResponsePostDTO;
    checkIsMine(email: string): Promise<boolean>;
    update(postId: number, updatePost: UpdatePostDto): Promise<void>;
    deletePost(postId: string): Promise<void>;
}
