import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostService } from './post.service';
import { RequestPostDto } from './request.post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/save')
  async setMyPost(@Request() req, @Body() post: RequestPostDto): Promise<string> {
    /** 글 등록 */
    await this.postService.createPost(req.user.email, post);

    /** 알림 생성 및
     *  등록된 태그 보유 account 모두 알림 등록 */
    return;
  }
}
