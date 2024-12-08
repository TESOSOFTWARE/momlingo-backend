import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index,
  OneToMany,
  JoinColumn, ManyToOne,
} from 'typeorm';
import { UserRole } from '../../../enums/user-role.enum';
import { LoginType } from '../../../enums/login-type.enum';
import { Exclude } from 'class-transformer';
import { Language } from '../../../enums/language.enum';
import { DeviceType } from '../../../enums/device-type.enum';
import { Gender } from '../../../enums/gender.enum';
import { Child } from '../../children/entities/child.entity';
import { NewCategory } from '../../news/entities/new-category.entity';
import { User } from '../../user/entities/user.entity';
import { PostStatus } from '../../../enums/post-status.enum';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @Index({ fulltext: true })
  content: string;

  @Column({ type: 'integer' })
  userId: number;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PUBLIC,
  })
  status: PostStatus;

  @Column({ default: true })
  enableComment: boolean;

  @Column({default: 0})
  likesCount: number;

  @Column({default: 0})
  commentsCount: number;

  @Column({default: 0})
  savesCount: number;

  @Column({default: 0})
  viewsCount: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
