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

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/setting')
  async setMyTags(
    @Request() req,
    @Body('tags') tags: string[],
  ): Promise<void> {
    await this.tagService.setMyTags(tags, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/setting')
  async getMyTags(@Request() req): Promise<string[]> {
    return await this.tagService.getMyTags(req.user.email);
  }
}
