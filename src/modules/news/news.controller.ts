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
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService, getMulterOptions } from '../file-upload/file-upload.service';
import { NewsService } from './news.service';
import { NewCategory } from './entities/new-category.entity';
import { NewCategoryDto } from './dtos/new-category.dto';
import { NewsDto } from './dtos/news.dto';
import { News } from './entities/news.entity';

@ApiTags('News')
@Controller('news')
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
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly fileUploadsService: FileUploadService,
  ) {
  }

  /// --- Controller for New Category - START ---
  @Post('/category')
  @ApiOperation({ summary: 'Tạo mới một Category' })
  async createCategory(
    @Body() newCategoryDto: NewCategoryDto,
    @Req() req,
  ): Promise<NewCategory> {
    return this.newsService.createCategory(newCategoryDto);
  }

  @Get('/category')
  @ApiOperation({ summary: 'Lấy danh sách tất cả Category' })
  async findAllCategory(): Promise<NewCategory[]> {
    return this.newsService.findAllCategory();
  }

  @Get('/category/:id')
  @ApiOperation({ summary: 'Lấy thông tin Category theo ID' })
  async findOneCategory(@Param('id') id: number): Promise<NewCategory> {
    console.log('Get ID');
    return this.newsService.findOneCategory(id);
  }

  @Put('/category/:id')
  @ApiOperation({ summary: 'Cập nhật Category theo ID' })
  async updateCategory(
    @Param('id') id: number,
    @Body() newCategoryDto: NewCategoryDto,
    @Req() req: any,
  ): Promise<NewCategory> {
    await this.newsService.findOneCategory(id);
    return await this.newsService.updateCategory(id, newCategoryDto);
  }

  @Delete('/category/:id')
  @ApiOperation({ summary: 'Xóa Category theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeCategory(@Param('id') id: number): Promise<void> {
    return this.newsService.deleteCategoryAndNews(id);
  }

  @Get('/search/category')
  @ApiOperation({
    summary: 'Tìm Category theo name',
  })
  async searchCategoryNames(
    @Query('name') name: string,
  ): Promise<NewCategory[]> {
    return this.newsService.findCategoryByName(name);
  }

  /// --- Controller for New Category - END ---

  /// --- Controller for News - START ---
  @Post('/new')
  @ApiOperation({ summary: 'Tạo mới một News' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', getMulterOptions('news-thumbnail')),
  )
  async createNews(
    @UploadedFile() file: Express.Multer.File,
    @Body() newsDto: NewsDto,
    @Req() req,
  ): Promise<News> {
    try {
      if (file) {
        newsDto.thumbnailUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
      }
      return this.newsService.createNews(newsDto);
    } catch (e) {
      if (file) {
        this.fileUploadsService.deleteFile(newsDto.thumbnailUrl);
      }
      throw e;
    }
  }

  @Get('/new')
  @ApiOperation({ summary: 'Lấy danh sách tất cả News' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllNews(
    @Query('currentPage') currentPage = 1,
  ) {
    const pageNumber = Number(currentPage);
    return this.newsService.findAllNews(pageNumber);
  }

  @Get('/new/category/:id')
  @ApiOperation({ summary: 'Lấy danh sách tất cả News theo category' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllNewsByCategoryId(@Param('id') id: number, @Query('currentPage') currentPage = 1) {
    const pageNumber = Number(currentPage);
    return this.newsService.findAllNewsByCategoryId(id, pageNumber);
  }

  @Get('/new/:id')
  @ApiOperation({ summary: 'Lấy thông tin News theo ID' })
  async findOneNews(@Param('id') id: number): Promise<News> {
    return this.newsService.findOneNews(id);
  }

  @Put('/new/:id')
  @ApiOperation({ summary: 'Cập nhật News theo ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', getMulterOptions('news-thumbnail')),
  )
  async updateNews(
    @Param('id') id: number,
    @Body() newsDto: NewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<News> {
    try {
      if (file) {
        newsDto.thumbnailUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
      }
      const news = await this.newsService.findOneNews(id);
      const newsRes = await this.newsService.updateNews(id, newsDto);
      if (file) {
        if (news.thumbnailUrl) {
          this.fileUploadsService.deleteFile(news.thumbnailUrl);
        }
      }
      return newsRes;
    } catch (e) {
      if (file) {
        this.fileUploadsService.deleteFile(newsDto.thumbnailUrl);
      }
      throw e;
    }
  }

  @Delete('/new/:id')
  @ApiOperation({ summary: 'Xóa News theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeNews(@Param('id') id: number): Promise<void> {
    const news = await this.newsService.findOneNews(id);
    await this.newsService.removeNews(id);
    if (news.thumbnailUrl) {
      this.fileUploadsService.deleteFile(news.thumbnailUrl);
    }
  }

  @Get('/search/new')
  @ApiOperation({
    summary: 'Tìm News theo title',
  })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async searchNewsNames(@Query('title') title: string, @Query('currentPage') currentPage = 1) {
    const pageNumber = Number(currentPage);
    return this.newsService.findNewsByTitle(title, pageNumber);
  }

  /// --- Controller for News - END ---
}
