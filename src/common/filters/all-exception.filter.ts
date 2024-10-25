import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      // Nếu là HttpException, lấy status và message
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof NotFoundException) {
      // Xử lý NotFoundException riêng
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    } else {
      // Nếu không phải là HttpException, trả về 500
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
