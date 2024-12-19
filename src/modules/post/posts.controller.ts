import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query, Req, UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth, ApiBody, ApiConsumes,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
import { extname } from 'path';
import { Post as MyPost } from './entities/post.entity';

const postMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const uploadPathTemp = `./uploads/posts/${currentYear}/${currentMonth}/temps`;
      console.log('uploadPathTemp', uploadPathTemp);
      try {
        await fs.ensureDir(uploadPathTemp);
        cb(null, uploadPathTemp);
      } catch (error) {
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      console.log('fileName', fileName);
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Due mobile is logging file.mimetype application/octet-stream
    /*if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }*/
    cb(null, true);
  },
};

@ApiTags('Posts')
@Controller('posts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy post detail theo id' })
  async findOne(@Param('id') id: number, @Req() req: any) {
    return this.postsService.getPostDetail(id, req);
  }

  @Post()
  @ApiBody({ type: CreatePostDto })
  @ApiOperation({
    summary: 'Tạo post',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description:
      'Tối đa 5 ảnh, mỗi ảnh k quá 5Mb',
  })
  @UseInterceptors(FilesInterceptor('images', 5, postMulterOptions))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<MyPost> {
    return await this.postsService.createPost(req, createPostDto, files);
  }

  @Get('/all/me')
  @ApiOperation({ summary: 'Lấy danh sách tất cả post của mình' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllMyPost(
    @Query('currentPage') currentPage = 1,
    @Req() req: any,
  ) {
    const pageNumber = Number(currentPage);
    return this.postsService.findAllMyPost(req, pageNumber);
  }

  @Get('/all/me/saved')
  @ApiOperation({ summary: 'Lấy danh sách tất cả post mà đã lưu' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllMyPostSaved(
      @Query('currentPage') currentPage = 1,
      @Req() req: any,
  ) {
    const pageNumber = Number(currentPage);
    return this.postsService.findAllMyPostSaved(req, pageNumber);
  }

  @Get('/all/guest/:userId')
  @ApiOperation({ summary: 'Lấy danh sách tất cả post public của user khách' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllPostOfGuest(
    @Param('userId') userId: number,
    @Query('currentPage') currentPage = 1,
    @Req() req: any,
  ) {
    const pageNumber = Number(currentPage);
    return this.postsService.findAllPostOfGuest(userId, req, pageNumber);
  }

  @Get('/all/new-feed')
  @ApiOperation({ summary: 'Lấy danh sách tất cả post của mọi người' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllPostOnNewFeed(
    @Query('currentPage') currentPage = 1,
    @Req() req: any,
  ) {
    const pageNumber = Number(currentPage);
    return this.postsService.findAllPostOnNewFeed(req, pageNumber);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Xoá post' })
  async delete(@Param('id') id: number, @Req() req: any) {
    return this.postsService.deletePost(id, req);
  }
}
