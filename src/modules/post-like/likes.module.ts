import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../post/posts.module';
import { Like } from './entities/like.entity';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { NotificationsModule } from '../notification/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    forwardRef(() => PostsModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
