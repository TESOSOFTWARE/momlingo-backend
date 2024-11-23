import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // const { method, originalUrl } = req;
    // const start = Date.now();
    //
    // res.on('finish', () => {
    //   const duration = Date.now() - start;
    //   this.logger.log(
    //     `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
    //   );
    // });

    const { method, originalUrl, headers, body } = req;
    this.logger.log(`Incoming Request: ${method} ${originalUrl}`);
    this.logger.log(`Headers: ${JSON.stringify(headers)}`);
    this.logger.log(`Body: ${JSON.stringify(body)}`);

    // Ghi lại thông tin phản hồi sau khi xử lý xong
    const start = Date.now();
    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      // Ghi lại thông tin phản hồi
      this.logger.log(`Outgoing Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
      this.logger.log(`Response Body: ${body}`);

      // Gọi hàm send gốc
      return originalSend(body);
    };

    next();
  }
}
