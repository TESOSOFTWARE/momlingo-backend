import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Gender } from '../../../enums/gender.enum';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'children' })
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column({ nullable: true })
  @Index()
  nickname: string;

  @Column('text', { nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.FEMALE,
  })
  gender: Gender;

  @ManyToOne(() => User, (user) => user.childrenAsMother, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  mother: User;

  @ManyToOne(() => User, (user) => user.childrenAsFather, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  father: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
