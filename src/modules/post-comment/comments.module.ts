import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { CommentsController } from './comments.controller';
import { PostsModule } from '../post/posts.module';
import { CommentsService } from './comments.service';
import { NotificationsModule } from '../notification/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), PostsModule, NotificationsModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
