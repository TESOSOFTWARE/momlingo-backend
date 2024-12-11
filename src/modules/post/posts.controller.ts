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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
import { extname } from 'path';
import * as path from 'path';
import { CreatePostInterceptor } from './interceptors/create-post.interceptor';
import { Post as MyPost} from './entities/post.entity';

const postMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const postId = req.body.postId;
      const uploadPath = `./uploads/posts/${postId}`;
      try {
        await fs.ensureDir(uploadPath);
        cb(null, uploadPath);
      } catch (error) {
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
};

@ApiTags('Tags')
@Controller('tags')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {
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
  @UseInterceptors(CreatePostInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 5 },
    ], postMulterOptions),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req: any,
  ): Promise<MyPost> {
    return await this.postsService.createPostImageAndTags(req, createPostDto, files.images);
  }
}
