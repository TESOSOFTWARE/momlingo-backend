import { Module } from '@nestjs/common';
import { BabyTrackersService } from './baby-trackers.service';
import { BabyTrackersController } from './baby-trackers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { BabyTracker } from './entities/baby-tracker.entity';
import { MomInfo } from './entities/mom-info.entity';
import { BabyInfo } from './entities/baby-info.entity';
import { WeekGuard } from './guards/week.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([BabyTracker, MomInfo, BabyInfo]),
    FileUploadModule,
  ],
  providers: [WeekGuard, BabyTrackersService],
  controllers: [BabyTrackersController],
  exports: [TypeOrmModule, BabyTrackersService],
})
export class BabyTrackersModule {}
