import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './entities/post-image.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TagsModule } from '../post-tag/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostImage]), TagsModule],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {
}
