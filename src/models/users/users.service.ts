import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserWithChildren } from './interfaces/user-with-children.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(userData: Partial<User>): Promise<UserWithChildren> {
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return {
      ...user,
      partner: null,
      children: [],
    } as UserWithChildren;
  }

  update(
    userId: number,
    userInformation: Partial<User>,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(userId, userInformation);
  }

  async findUserWithPartnerAndChildrenById(
    id: number,
  ): Promise<UserWithChildren> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['partner', 'childrenAsMother', 'childrenAsFather'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    const children =
      user.gender === 'female' ? user.childrenAsMother : user.childrenAsFather;
    return {
      ...user,
      children,
    } as UserWithChildren;
  }

  async findUserWithPartnerAndChildrenByEmail(
    email: string,
  ): Promise<UserWithChildren> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['partner', 'childrenAsMother', 'childrenAsFather'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    const children =
      user.gender === 'female' ? user.childrenAsMother : user.childrenAsFather;
    return {
      ...user,
      children,
    } as UserWithChildren;
  }
}
