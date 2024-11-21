import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { MusicCategoryType } from '../../../enums/music-category-type.enum';
import { MusicSong } from './music-song.entity';

@Entity('music_categories')
export class MusicCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: MusicCategoryType,
    default: MusicCategoryType.NORMAL,
  })
  type: MusicCategoryType;

  @OneToMany(() => MusicSong, (musicSong) => musicSong.category)
  songs: MusicSong[];
}
