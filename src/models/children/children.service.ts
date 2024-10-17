import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateChildDto } from './dtos/create-child.dto';
import { Gender } from '../../enums/gender.enum';
import { User } from '../users/entities/user.entity';
import { UpdateChildDto } from './dtos/update-child.dto';

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

  async updateChild(
    id: number,
    updateChildDto: UpdateChildDto,
    userId: number,
  ): Promise<Child> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const child = await this.childrenRepository.findOne({ where: { id } });
    if (!child) {
      throw new NotFoundException('Child not found');
    }
    if (updateChildDto.dateOfBirth) {
      child.dateOfBirth = new Date(updateChildDto.dateOfBirth);
    }
    Object.assign(child, updateChildDto);
    return this.childrenRepository.save(child);
  }

  async deleteChild(id: number, userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const child = await this.childrenRepository.findOne({ where: { id } });
    if (!child) {
      throw new NotFoundException('Child not found');
    }
    if (
      (child.gender == Gender.FEMALE &&
        child.mother != null &&
        child.mother.id !== userId) ||
      (child.gender == Gender.MALE &&
        child.father != null &&
        child.father.id !== userId)
    ) {
      throw new UnauthorizedException(
        'You are not authorized to delete this child',
      );
    }
    await this.childrenRepository.remove(child);
  }
}
