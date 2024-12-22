import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';
import { FileUploadService } from '../../modules/file-upload/file-upload.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly fileUploadService: FileUploadService) {
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('AllExceptionFilter catch');

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      if (Array.isArray((responseBody as any).message)) {
        message = (responseBody as any).message[0];
      } else {
        message = (responseBody as any).message || responseBody;
      }
      error = (responseBody as any).error || 'Unknown Error';
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'Internal Server Error';
    } else {
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${message}`,
    );

    // Kiểm tra xem có file trong request không và xóa chúng nếu có
    const files = request['files'] || (request['file'] ? [request['file']] : null); // Cả trường hợp file và files

    try {
      if (files) {
        for (const file of files) {
          await this.fileUploadService.deleteFile(file.path); // Xóa từng file
        }
      }
    } catch (deleteError) {
      console.error('Error deleting uploaded file:', deleteError.message);
    }

    response.status(status).json({
      message: message,
      error: error,
      statusCode: status,
    });
  }
}
