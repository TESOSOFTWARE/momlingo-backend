import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsController } from './follows.controller';
import { Follow } from './entities/follow.entity';
import { FollowsService } from './follows.service';
import { UsersModule } from '../user/users.module';
import { NotificationsModule } from '../notification/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow]), forwardRef(() => UsersModule), NotificationsModule],
  providers: [FollowsService],
  controllers: [FollowsController],
  exports: [FollowsService],
})
export class FollowsModule {}
