import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, JoinColumn,
} from 'typeorm';
import { NewCategory } from './new-category.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;

  @Column('text')
  @Index({ fulltext: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  @Index({ fulltext: true })
  description: string;

  @Column()
  url: string;

  @Column({default: 0})
  views: number;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'integer' })
  categoryId: number;

  @ManyToOne(() => NewCategory)
  @JoinColumn({ name: 'categoryId' })
  category: NewCategory;

  @BeforeInsert()
  setDefaultPublishedAt() {
    // Thiết lập giá trị mặc định cho publishedAt khi isPublished là true
    if (this.isPublished) {
      this.publishedAt = new Date();
    }
  }

  @BeforeUpdate()
  updatePublishedAt() {
    // Cập nhật publishedAt khi isPublished thay đổi thành true
    if (this.isPublished) {
      this.publishedAt = new Date();
    }
  }
}
