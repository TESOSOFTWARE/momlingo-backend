import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigAppModule } from './config/app/config.app.module';
import { UsersModule } from './modules/user/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import typeOrmConfig from './config/database/mysql/typeorm.config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { APP_FILTER } from '@nestjs/core';
import { ChildrenModule } from './modules/children/children.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { BabyTrackersModule } from './modules/baby-tracker/baby-trackers.module';
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
    BabyTrackersModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
