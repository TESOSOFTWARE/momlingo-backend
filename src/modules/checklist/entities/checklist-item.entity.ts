import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { ChecklistItemStatus } from '../../../enums/checklist-item-status.enum';
import { Checklist } from './checklist.entity';

@Entity('checklist-items')
export class ChecklistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ChecklistItemStatus,
    default: ChecklistItemStatus.TODO,
  })
  status: ChecklistItemStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  planingDate: Date;

  @Column({ type: 'integer' })
  checklistId: number;

  @ManyToOne(() => Checklist, (checklist) => checklist.checklistItems)
  @JoinColumn({ name: 'checklistId' })
  checklist: Checklist;
}
