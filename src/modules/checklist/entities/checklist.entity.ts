import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TaskGroupType } from '../../../enums/task-group-type.enum';

import { ChecklistItem } from './checklist-item.entity';

@Entity('checklists')
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskGroupType,
    default: TaskGroupType.OTHER,
  })
  taskGroupType: TaskGroupType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  endDate: Date;

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.checklist, {
    onDelete: 'CASCADE',
  })
  checklistItems: ChecklistItem[];
}
