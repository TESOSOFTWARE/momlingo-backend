import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigAppModule } from './config/app/config.app.module';
import { UsersModule } from './modules/user/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import typeOrmConfig from './config/database/mysql/typeorm.config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { APP_FILTER } from '@nestjs/core';
import { ChildrenModule } from './modules/children/children.module';
import { UsersController } from './modules/user/users.controller';
import { UsersService } from './modules/user/users.service';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { FileUploadController } from './modules/file-upload/file-upload.controller';
import { FileUploadService } from './modules/file-upload/file-upload.service';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
dotenv.config();

@Module({
  imports: [
    ConfigAppModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => typeOrmConfig,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    UsersModule,
    ChildrenModule,
    AuthModule,
    FileUploadModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    FileUploadController,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AuthService,
    UsersService,
    FileUploadService,
  ],
})
export class AppModule {}
