import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { FileUploadService, getMulterOptions } from './file-upload.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@UseGuards(JwtGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('user-avatar')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('user-avatars')))
  async uploadUserAvatar(@UploadedFile() file: Express.Multer.File) {
    // const savedFile = await this.fileUploadService.saveFile(file);
    return { message: 'Avatar uploaded successfully', file: file.path };
  }

  @Post('child-avatar')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('child-avatars')))
  async uploadChildAvatar(@UploadedFile() file: Express.Multer.File) {
    // const savedFile = await this.fileUploadService.saveFile(file);
    return { message: 'Avatar uploaded successfully', file: file.path };
  }
}
