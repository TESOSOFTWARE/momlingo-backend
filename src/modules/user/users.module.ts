import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ChildrenModule } from '../children/children.module';
import { FollowsModule } from '../follow/follows.module';
import { PostsModule } from '../post/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ChildrenModule),
    forwardRef(() => FollowsModule),
    FileUploadModule,
    PostsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
