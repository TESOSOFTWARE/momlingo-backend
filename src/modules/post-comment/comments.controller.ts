import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation, ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreatePostCommentDto } from './dtos/create-post-comment.dto';

@ApiTags('Post Comment')
@Controller('post-comments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @Post()
  @ApiOperation({ summary: 'Tạo comment' })
  async create(@Body() createPostCommentDto: CreatePostCommentDto, @Req() req: any) {
    return this.commentsService.createComment(createPostCommentDto, req);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Xoá comment' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return this.commentsService.deleteCommentsById(id, req);
  }

  @Get('/posts/:postId')
  @ApiOperation({ summary: 'Get comment theo post id' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async getAllCommentByPostId(
    @Param('postId') postId: number,
    @Query('currentPage') currentPage = 1, @Req() req: any) {
    const pageNumber = Number(currentPage);
    return this.commentsService.getAllCommentByPostId(postId, pageNumber, req);
  }
}
