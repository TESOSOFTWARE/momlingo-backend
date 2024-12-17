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
import { SavesService } from './saves.service';

@ApiTags('Post Save')
@Controller('post-saves')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class SavesController {
  constructor(private readonly savesService: SavesService) {
  }

  @Post('/save')
  @ApiBody({
    description: 'Post ID to save',
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'number' },
      },
      required: ['postId'],
    },
  })
  @ApiOperation({ summary: 'Save post' })
  async savePost(@Body() body: { postId: number }, @Req() req: any) {
    const { postId } = body;
    return this.savesService.savePost(postId, req);
  }

  @Post('/unSave')
  @ApiBody({
    description: 'Post ID to save',
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'number' },
      },
      required: ['postId'],
    },
  })
  @ApiOperation({ summary: 'UnSave post' })
  async unSavePost(@Body() body: { postId: number }, @Req() req: any) {
    const { postId } = body;
    return this.savesService.unSavePost(postId, req);
  }

  @Get('/all/:postId')
  @ApiOperation({ summary: 'Get saves theo post id' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async getAllSaveByPostId(
    @Param('postId') postId: number,
    @Query('currentPage') currentPage = 1, @Req() req: any) {
    const pageNumber = Number(currentPage);
    return this.savesService.getAllSaveByPostId(postId, pageNumber, req);
  }
}
