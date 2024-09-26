import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from "./config/database/mysql/data.source";

async function bootstrap() {
  // Khởi tạo DataSource
  await AppDataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((error) => {
        console.error('Error during Data Source initialization', error);
      });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
