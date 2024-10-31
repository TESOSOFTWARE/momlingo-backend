import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('child-trackers')
export class ChildTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  week: number;

  @Column('text', { nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
