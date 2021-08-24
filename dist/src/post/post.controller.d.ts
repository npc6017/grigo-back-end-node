import { RequestPostDto } from './dto/request.post.dto';
import { PostService } from './post.service';
import { ResponsePostDTO } from './dto/response.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
export declare class PostController {
    private postService;
    constructor(postService: PostService);
    setMyPost(req: any, post: RequestPostDto): Promise<string>;
    getPosts(req: any, query: any): Promise<{
        postDTOS: ResponsePostDTO[];
        hasNext: boolean;
    }>;
    getPost(req: any, postId: any): Promise<ResponsePostDTO>;
    updatePost(request: any, postId: number, updatePost: UpdatePostDto): Promise<string>;
    deletePost(request: any, postId: string): Promise<string>;
}
