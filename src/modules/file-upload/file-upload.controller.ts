import { Controller, UseGuards } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('upload')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}
}
