import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { MusicCategory } from './music-category.entity';

@Entity('music_songs')
export class MusicSong {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column()
  artist: string;

  @Column()
  fileUrl: string;

  @Column('text')
  description: string;

  @ManyToOne(() => MusicCategory, (category) => category.songs)
  category: MusicCategory;
}
