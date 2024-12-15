import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { CommentsController } from './comments.controller';
import { PostsModule } from '../post/posts.module';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), PostsModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
