import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateChildDto } from './dtos/create-child.dto';
import { Gender } from '../../enums/gender.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private childrenRepository: Repository<Child>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Child[]> {
    return this.childrenRepository.find();
  }

  findOneById(id: number): Promise<Child | null> {
    return this.childrenRepository.findOneBy({ id });
  }

  create(childData: Partial<Child>): Promise<Child> {
    const child = this.childrenRepository.create(childData);
    return this.childrenRepository.save(child);
  }

  update(
    userId: number,
    userInformation: Partial<Child>,
  ): Promise<UpdateResult> {
    return this.childrenRepository.update(userId, userInformation);
  }

  async createChild(
    createChildDto: CreateChildDto & { dateOfBirth: Date },
    userId: number,
  ): Promise<Child> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const child = this.childrenRepository.create({
      ...createChildDto,
      dateOfBirth: createChildDto.dateOfBirth,
      mother: user.gender === 'female' ? user : null,
      father: user.gender === 'male' ? user : null,
    });

    const savedChild = await this.childrenRepository.save(child);

    const mother = savedChild.mother
      ? await this.usersRepository.findOne({
          where: { id: savedChild.mother.id },
        })
      : null;
    const father = savedChild.father
      ? await this.usersRepository.findOne({
          where: { id: savedChild.father.id },
        })
      : null;

    return {
      ...savedChild,
      mother,
      father,
    };
  }
}
