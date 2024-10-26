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
import { User } from '../user/entities/user.entity';
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

  findAllByUserId(userId: number): Promise<Child[]> {
    return this.childrenRepository.find({
      where: [{ mother: { id: userId } }, { father: { id: userId } }],
    });
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
    createChildDto: CreateChildDto,
    userId: number,
  ): Promise<Child> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const child = this.childrenRepository.create({
      ...createChildDto,
      mother: user.gender === 'female' ? user : null,
      father: user.gender === 'male' ? user : null,
    });
    return await this.childrenRepository.save(child);
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
