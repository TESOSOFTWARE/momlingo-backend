import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Param, UseGuards, UploadedFile, Get,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('upload')
@UseGuards(JwtGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get('user-avatar')
  // @UseInterceptors(
  //   FileInterceptor('avatar',  this.fileUploadService.uploadUserAvatar()).caller,
  // )
  uploadUserAvatar(@UploadedFile() file: Express.Multer.File) {
    console.log("file.filename:");
    console.log(file.filename);

    return file.filename;
  }
}
