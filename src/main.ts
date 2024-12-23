import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API List')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Cấu hình CORS
  app.enableCors({
    origin: 'https://admin.momlingo.com', // Chỉ cho phép yêu cầu từ domain này
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP cho phép
    allowedHeaders: 'Content-Type, Accept, Authorization, Referer', // Cho phép các header cần thiết
    credentials: true, // Nếu có sử dụng cookies hoặc thông tin xác thực
  });

  await app.listen(3000);
}
bootstrap();
