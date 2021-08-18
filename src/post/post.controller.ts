import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestPostDto } from './dto/request.post.dto';
import { PostService } from './post.service';
import { ResponsePostDTO } from './dto/response.post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  /** Save Post */
  @UseGuards(JwtAuthGuard)
  @Post('/save')
  async setMyPost(@Request() req, @Body() post: RequestPostDto): Promise<string> {
    /** 글 등록 */
    await this.postService.createPost(req.user.email, post);

    /** 알림 생성 및
     *  등록된 태그 보유 account 모두 알림 등록 */
    return;
  }

  /** Get Posts */
  @UseGuards(JwtAuthGuard)
  @Get('/board')
  async getPosts(@Request() req, @Query() query): Promise<ResponsePostDTO[]> {
    return await this.postService.getMyPosts(req.user.email, query);
  }

  /** Get Post */
  @UseGuards(JwtAuthGuard)
  @Get('/:postId')
  async getPost(@Request() req, @Param('postId') postId): Promise<ResponsePostDTO> {
    return await this.postService.getMyPost(req.user.email, postId);
  }
}
