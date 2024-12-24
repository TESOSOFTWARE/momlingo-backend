import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../post/posts.module';
import { Save } from './entities/save.entity';
import { SavesService } from './saves.service';
import { SavesController } from './saves.controller';
import { NotificationsModule } from '../notification/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Save]), forwardRef(() => PostsModule), forwardRef(() => NotificationsModule)],
  providers: [SavesService],
  controllers: [SavesController],
  exports: [SavesService],
})
export class SavesModule {}
