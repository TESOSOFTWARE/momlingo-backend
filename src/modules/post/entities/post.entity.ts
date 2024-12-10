import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
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
import { Tag } from '../../post-tag/entities/tag.entity';
import { PostImage } from './post-image.entity';
import { Like } from '../../post-like/entities/like.entity';
import { Save } from '../../post-save/entities/save.entity';
import { PostComment } from '../../post-comment/entities/post-comment.entity';

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

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  savesCount: number;

  @Column({ default: 0 })
  viewsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({ name: 'post_tags' })
  tags: Tag[];

  @OneToMany(() => PostImage, (postImage) => postImage.post, { cascade: true })
  images: PostImage[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Save, (save) => save.post)
  saves: Save[];

  @OneToMany(() => PostComment, (comment) => comment.post)
  comments: PostComment[];
}
