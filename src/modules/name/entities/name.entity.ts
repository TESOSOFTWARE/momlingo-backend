import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Gender } from '../../../enums/gender.enum';
import { Language } from '../../../enums/language.enum';

@Entity('names')
export class Name {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column('text')
  meaning: string;

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
}
