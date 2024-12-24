import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './entities/post-image.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TagsModule } from '../post-tag/tags.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { LikesModule } from '../post-like/likes.module';
import { SavesModule } from '../post-save/saves.module';
import { NotificationsModule } from '../notification/notifications.module';
import { FollowsModule } from '../follow/follows.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostImage]),
    forwardRef(() => LikesModule), forwardRef(() => SavesModule),
    TagsModule, FileUploadModule, forwardRef(() => NotificationsModule), FollowsModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {
}
