import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestPostDto } from './dto/request.post.dto';
import { PostService } from './post.service';
import { ResponsePostDTO } from './dto/response.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  /** Save Post */
  @UseGuards(JwtAuthGuard)
  @Post('/save')
  async setMyPost(
    @Request() req,
    @Body() post: RequestPostDto,
  ): Promise<string> {
    /** 글 등록 */
    await this.postService.createPost(req.user.email, post);

    /** 알림 생성 및
     *  등록된 태그 보유 account 모두 알림 등록 */
    return;
  }

  /** Get Posts */
  @UseGuards(JwtAuthGuard)
  @Get('/board')
  async getPosts(@Request() req, @Query() query) {
    return await this.postService.getMyPosts(req.user.email, query);
  }

  /** Get Post */
  @UseGuards(JwtAuthGuard)
  @Get('/:postId')
  async getPost(
    @Request() req,
    @Param('postId') postId,
  ): Promise<ResponsePostDTO> {
    return await this.postService.getMyPost(req.user.email, postId);
  }

  /** Update Post */
  @UseGuards(JwtAuthGuard)
  @Post('/:postId/update')
  async updatePost(
    @Request() request,
    @Param('postId') postId: number,
    @Body() updatePost: UpdatePostDto,
  ): Promise<string> {
    // 본인의 게시글인지 확인
    const isCheck = await this.postService.checkIsMine(request.user.email);
    if (!isCheck) throw new ForbiddenException();
    // 게시글 업데이트 진행
    await this.postService.update(postId, updatePost);
    return 'post update successful';
  }

  /** Delete Post */
  @UseGuards(JwtAuthGuard)
  @Post('/:postId/delete')
  async deletePost( @Request() request, @Param('postId') postId: string): Promise<string> {
    // 본인의 게시글인지 확인
    const isCheck = await this.postService.checkIsMine(request.user.email);
    // 삭제 진행
    await this.postService.deletePost(postId);
    return 'post delete successful';
  }
}
