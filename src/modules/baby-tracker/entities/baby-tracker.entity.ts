import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne, JoinColumn,
} from 'typeorm';
import { BabyInfo } from './baby-info.entity';
import { MomInfo } from './mom-info.entity';

@Entity('baby_trackers')
export class BabyTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  week: number;

  @Column({ type: 'text', nullable: true })
  keyTakeaways: string;

  @OneToOne(() => BabyInfo)
  @JoinColumn()
  babyInfo: BabyInfo;

  @OneToOne(() => MomInfo)
  @JoinColumn()
  momInfo: MomInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
