import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
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

    response.status(status).json({
      message: message,
      error: error,
      statusCode: status,
    });
  }
}
