import { Module } from '@nestjs/common';
import { MusicsService } from './musics.service';
import { MusicsController } from './musics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicCategory } from './entities/music-category.entity';
import { MusicSong } from './entities/music-song.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MusicCategory, MusicSong]),
    FileUploadModule,
  ],
  providers: [MusicsService],
  controllers: [MusicsController],
  exports: [MusicsService],
})
export class MusicsModule {}
