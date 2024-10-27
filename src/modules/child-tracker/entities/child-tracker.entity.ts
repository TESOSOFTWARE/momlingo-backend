import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('child-baby-trackers')
export class BabyInfo {
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
