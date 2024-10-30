import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { BabyTracker } from './baby-tracker.entity';

@Entity('baby_infos')
export class BabyInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  week: number;

  @Column('double')
  weight: number;

  @Column('double')
  high: number;

  @Column({ nullable: true })
  thumbnail3DUrl: string;

  @Column({ nullable: true })
  image3DUrl: string;

  @Column('text', { nullable: true })
  symbolicImageUrl: string;

  @Column('text', { nullable: true })
  sizeShortDescription: string;

  @Column('text', { nullable: true })
  babyOverallInfo: string;

  @Column('text', { nullable: true })
  babySizeInfo: string;

  @OneToOne(() => BabyTracker, (babyTracker) => babyTracker.babyInfo)
  babyTracker: BabyTracker;
}
