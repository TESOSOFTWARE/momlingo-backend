import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query, Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth, ApiBody,
  ApiOperation, ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';

@ApiTags('Post Like')
@Controller('post-likes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {
  }

  @Post('/like')
  @ApiBody({
    description: 'Post ID to like',
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'number' },
      },
      required: ['postId'],
    },
  })
  @ApiOperation({ summary: 'Like post' })
  async likePost(@Body() body: { postId: number }, @Req() req: any) {
    const { postId } = body;
    return this.likesService.likePost(postId, req);
  }

  @Post('/unLike')
  @ApiBody({
    description: 'Post ID to like',
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'number' },
      },
      required: ['postId'],
    },
  })
  @ApiOperation({ summary: 'UnLike post' })
  async unlikePost(@Body() body: { postId: number }, @Req() req: any) {
    const { postId } = body;
    return this.likesService.unlikePost(postId, req);
  }

  @Get('/all/:postId')
  @ApiOperation({ summary: 'Get likes theo post id' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async getAllLikeByPostId(
    @Param('postId') postId: number,
    @Query('currentPage') currentPage = 1, @Req() req: any) {
    const pageNumber = Number(currentPage);
    return this.likesService.getAllLikeByPostId(postId, pageNumber, req);
  }
}
