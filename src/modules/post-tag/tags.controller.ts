import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Gender } from '../../enums/gender.enum';
import { Language } from '../../enums/language.enum';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {
  }

  @Post()
  @ApiOperation({ summary: 'Tạo tag từ list string' })
  async create(@Body() names: string[]): Promise<Tag[]> {
    return this.tagsService.createTags(names);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm tag theo name' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async searchTags(
    @Query('name') name: string,
    @Query('currentPage') currentPage = 1,
  ) {
    const pageNumber = Number(currentPage);
    return this.tagsService.searchTags(name, pageNumber);
  }

}
