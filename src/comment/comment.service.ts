import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '../entities/Account';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}
  /** Set Comment */
  async setComment(
    account: Account,
    post: Post,
    content: string,
  ): Promise<void> {
    await this.commentRepository.save({
      account: account,
      post: post,
      content: content,
    });
  }
  /** Check Account */
  async checkAccount(account: Account, commentId: number): Promise<boolean> {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .select()
      .whereInIds(commentId)
      .innerJoinAndSelect('comment.account', 'account')
      .getOne();
    if(!comment) throw new BadRequestException();
    return account.id == comment.account.id;
  }
  /** Update Comment */
  async updateComment(commentId: number, content: string): Promise<void> {
    await this.commentRepository
      .createQueryBuilder()
      .update({ content: content})
      .whereInIds(commentId)
      .execute();
  }
  /** Delete Comment */
  async deleteComment(commentId: number): Promise<void> {
    await this.commentRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(commentId)
      .execute()
      .catch(() => {
        throw new BadRequestException();
      });
  }
}
