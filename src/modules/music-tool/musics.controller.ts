import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MusicsService } from './musics.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MusicCategoryDto } from './dtos/music-category.dto';
import { MusicCategory } from './entities/music-category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileUploadService,
  getMulterOptions,
} from '../file-upload/file-upload.service';

@ApiTags('Music Tool')
@Controller('musics')
@ApiBearerAuth()
@ApiResponse({
  status: 400,
  description:
    'Lỗi 400 hoặc các lỗi khác sẽ trả về dạng: {\n' +
    '    "message": "User not found",\n' +
    '    "statusCode": 500,\n' +
    '    "error"": "Internal server error"\n' +
    '}',
})
@UseGuards(JwtGuard)
export class MusicsController {
  constructor(
    private readonly musicsService: MusicsService,
    private readonly fileUploadsService: FileUploadService,
  ) {}

  @Post('/category')
  @ApiOperation({ summary: 'Tạo mới một Category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', getMulterOptions('music-categories')),
  )
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() categoryDto: MusicCategoryDto,
    @Req() req,
  ): Promise<MusicCategory> {
    if (file) {
      categoryDto.thumbnailUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
    }
    return this.musicsService.createCategory(categoryDto);
  }

  @Get('/category')
  @ApiOperation({ summary: 'Lấy danh sách tất cả Category' })
  async findAllCategory(): Promise<MusicCategory[]> {
    return this.musicsService.findAllCategory();
  }

  @Get('/category/:id')
  @ApiOperation({ summary: 'Lấy thông tin Category theo ID' })
  async findOneCategory(@Param('id') id: number): Promise<MusicCategory> {
    console.log('Get ID');
    return this.musicsService.findOneCategory(id);
  }

  @Put('/category/:id')
  @ApiOperation({ summary: 'Cập nhật Category theo ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', getMulterOptions('music-categories')),
  )
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: MusicCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<MusicCategory> {
    const category = await this.musicsService.findOneCategory(id);

    if (file) {
      if (category.thumbnailUrl) {
        this.fileUploadsService.deleteFile(category.thumbnailUrl);
      }
      categoryDto.thumbnailUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
    }

    return this.musicsService.updateCategory(id, categoryDto);
  }

  @Delete('/category/:id')
  @ApiOperation({ summary: 'Xóa Category theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeCategory(@Param('id') id: number): Promise<void> {
    const category = await this.musicsService.findOneCategory(id);
    if (category.thumbnailUrl) {
      this.fileUploadsService.deleteFile(category.thumbnailUrl);
    }
    return this.musicsService.removeCategory(id);
  }

  @Get('/search/category')
  @ApiOperation({
    summary: 'Tìm Category theo name',
  })
  async searchNames(@Query('name') name: string): Promise<MusicCategory[]> {
    return this.musicsService.findCategoryByName(name);
  }
}
