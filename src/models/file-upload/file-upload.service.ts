import { Injectable, NotFoundException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class FileUploadService {
  private createMulterOptions(folder: string) {
    return {
      storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.indexOf(file.mimetype) !== -1) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    };
  }

  uploadUserAvatar() {
    return this.createMulterOptions('user-avatars');
  }

  uploadChildAvatar() {
    return this.createMulterOptions('child-avatars');
  }

  uploadPostImages(year: number, postId: number) {
    return this.createMulterOptions('posts');
  }

  uploadBabyTrackerImages(week: number) {
    return this.createMulterOptions('trackers/week-' + week);
  }

  deleteFile(fullPath: string): void {
    try {
      unlinkSync(fullPath);
    } catch (error) {
      throw new NotFoundException(`File at ${fullPath} not found`);
    }
  }
}

/*
// src/user/user.controller.ts
import { Controller, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { diskStorage } from 'multer';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }))
  async create(@Body() userData: Partial<User>, @UploadedFile() avatar: Express.Multer.File) {
    if (avatar) {
      userData.avatar = avatar.filename;
    }
    return this.userService.create(userData);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }))
  async edit(@Param('id') id: number, @Body() userData: Partial<User>, @UploadedFile() avatar: Express.Multer.File) {
    if (avatar) {
      userData.avatar = avatar.filename;
    }
    return this.userService.edit(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}*/

/*
// src/file-upload/file-upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('avatar')
  @UseInterceptors(FilesInterceptor('avatar', 1, this.fileUploadService.uploadAvatar()))
  uploadAvatar(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }

  @Post('news-images')
  @UseInterceptors(FilesInterceptor('images', 10, this.fileUploadService.uploadNewsImages()))
  uploadNewsImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }

  @Post('post-images')
  @UseInterceptors(FilesInterceptor('images', 10, this.fileUploadService.uploadPostImages()))
  uploadPostImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }
}
* */

/*
// src/file-upload/file-upload.module.ts
import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
* */

/*
// src/file-upload/file-upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFiles, Delete, Param } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('avatar')
  @UseInterceptors(FilesInterceptor('avatar', 1, this.fileUploadService.uploadAvatar()))
  uploadAvatar(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }

  @Post('news-images')
  @UseInterceptors(FilesInterceptor('images', 10, this.fileUploadService.uploadNewsImages()))
  uploadNewsImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }

  @Post('post-images')
  @UseInterceptors(FilesInterceptor('images', 10, this.fileUploadService.uploadPostImages()))
  uploadPostImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map(file => file.filename);
  }

  @Delete(':folder/:filename')
  deleteFile(@Param('folder') folder: string, @Param('filename') filename: string) {
    this.fileUploadService.deleteFile(folder, filename);
    return { message: `File ${filename} deleted successfully from ${folder}.` };
  }
}

* */

/*
thiết kế api cho create, edit, delete user có tính năng upload avatar, ngoài ra ứng dụng còn có tính năng đăng bài với nhiều ảnh, tạo tin tức nên cần upload ảnh vào các folder khác nhau nên cần thiết kế module file upload riêng trong nestjs với mysql
* */
