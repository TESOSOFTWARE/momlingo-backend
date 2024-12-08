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

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
