import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountService } from '../account/account.service';

@Controller('tag')
export class TagController {
  constructor(
    private tagService: TagService,
    private accountService: AccountService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/setting')
  async setMyTags(@Request() req, @Body('tags') tags: string[]): Promise<void> {
    const account = await this.accountService.findByEmail(req.user.email);
    await this.tagService.setMyTags(tags, account);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/setting')
  async getMyTags(@Request() req): Promise<string[]> {
    return await this.tagService.getMyTags(req.user.email);
  }
}
