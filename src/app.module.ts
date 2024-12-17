import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { ChildTrackersModule } from './modules/child-tracker/child-trackers.module';
import { NamesModule } from './modules/name/names.module';
import { MusicsModule } from './modules/music-tool/musics.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { NewsModule } from './modules/news/news.module';
import { ChecklistsModule } from './modules/checklist/checklists.module';
import { TagsModule } from './modules/post-tag/tags.module';
import { PostsModule } from './modules/post/posts.module';
import { CommentsModule } from './modules/post-comment/comments.module';
import { LikesModule } from './modules/post-like/likes.module';
import { SavesModule } from './modules/post-save/saves.module';
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
    AuthModule,
    UsersModule,
    ChildrenModule,
    BabyTrackersModule,
    ChildTrackersModule,
    FileUploadModule,
    NamesModule,
    MusicsModule,
    NewsModule,
    ChecklistsModule,
    TypeOrmModule,
    TagsModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    SavesModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
