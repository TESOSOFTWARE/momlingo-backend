import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UsersModule } from '../user/users.module';
import { PostsModule } from '../post/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UsersModule, forwardRef(() => PostsModule)],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
