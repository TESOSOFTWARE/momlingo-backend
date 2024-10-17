import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index, OneToMany,
} from 'typeorm';
import { UserRole } from '../../../enums/user-role.enum';
import { LoginType } from '../../../enums/login-type.enum';
import { Exclude } from 'class-transformer';
import { Language } from '../../../enums/language.enum';
import { DeviceType } from '../../../enums/device-type.enum';
import { Gender } from '../../../enums/gender.enum';
import {Child} from "../../children/entities/child.entity";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column()
  @Index()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  @Index()
  phoneNumber: string;

  @Column({ nullable: true })
  deviceId: string;

  @Column({ nullable: true })
  @Exclude()
  deviceToken: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.OTHER,
  })
  deviceType: DeviceType;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: LoginType,
    default: LoginType.EMAIL,
  })
  loginType: LoginType;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.VI,
  })
  lan: Language;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.FEMALE,
  })
  gender: Gender;

  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  partner: User;

  @OneToMany(() => Child, (child) => child.mother)
  childrenAsMother: Child[];

  @OneToMany(() => Child, (child) => child.father)
  childrenAsFather: Child[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
