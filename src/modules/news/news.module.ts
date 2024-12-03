import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { NewCategory } from './entities/new-category.entity';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { NewsController } from './news.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewCategory, News]),
    FileUploadModule,
  ],
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {
}
