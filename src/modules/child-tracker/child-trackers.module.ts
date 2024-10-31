import { Module } from '@nestjs/common';
import { ChildTrackersService } from './child-trackers.service';
import { ChildTrackersController } from './child-trackers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildTracker } from './entities/child-tracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildTracker])],
  providers: [ChildTrackersService],
  controllers: [ChildTrackersController],
  exports: [ChildTrackersService],
})
export class ChildTrackersModule {}
