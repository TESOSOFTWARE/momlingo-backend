import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { BabyTracker } from './baby-tracker.entity';

@Entity('mom_infos')
export class MomInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  week: number;

  @Column({ nullable: true })
  thumbnail3DUrl: string;

  @Column({ nullable: true })
  image3DUrl: string;

  @Column('text', { nullable: true })
  symptoms: string;

  @Column('text', { nullable: true })
  thingsTodo: string;

  @Column('text', { nullable: true })
  thingsToAvoid: string;

  @OneToOne(() => BabyTracker, (babyTracker) => babyTracker.momInfo)
  babyTracker: BabyTracker;
}
