import {
  BadRequestException,
  Body,
  Controller, ForbiddenException,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostService } from '../post/post.service';
import { AccountService } from '../account/account.service';

@Controller('')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private postService: PostService,
    private accountService: AccountService,
  ) {}
  /** Set Comment */
  @UseGuards(JwtAuthGuard)
  @Post('/:postId/comment')
  async setComment(
    @Request() req,
    @Body('content') content: string,
    @Param('postId') postId: number,
  ): Promise<string> {
    const post = await this.postService.findByPostId(postId);
    if (!post) throw new BadRequestException();
    const account = await this.accountService.findByEmail(req.user.email);
    await this.commentService.setComment(account, post, content);
    return '댓글이 성공적으로 작성되었습니다.';
  }
  /** Update Comment */
  @UseGuards(JwtAuthGuard)
  @Post('/comment/change/:commentId')
  async updateComment(
    @Request() req,
    @Body('content') content: string,
    @Param('commentId') commentId: number,
  ): Promise<string> {
    const account = await this.accountService.findByEmail(req.user.email);
    const isCheck = await this.commentService.checkAccount(account, commentId);
    if(!isCheck) throw new ForbiddenException();
    await this.commentService.updateComment(commentId, content);
    return '댓글이 성공적으로 수정되었습니다.';
  }
  /** Delete Comment */
  @UseGuards(JwtAuthGuard)
  @Post('comment/:commentId')
  async deleteComment(
    @Request() req,
    @Param('commentId') commentId: number,
  ): Promise<string> {
    const account = await this.accountService.findByEmail(req.user.email);
    const isCheck = await this.commentService.checkAccount(account, commentId);
    if(!isCheck) throw new ForbiddenException();
    await this.commentService.deleteComment(commentId);
    return '댓글이 정상적으로 삭제되었습니다.';
  }
}
