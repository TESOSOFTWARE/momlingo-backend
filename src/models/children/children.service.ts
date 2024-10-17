import { Injectable } from '@nestjs/common';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private usersRepository: Repository<Child>,
  ) {}

  findAll(): Promise<Child[]> {
    return this.usersRepository.find();
  }

  findOneById(id: number): Promise<Child | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(childData: Partial<Child>): Promise<Child> {
    const child = this.usersRepository.create(childData);
    return this.usersRepository.save(child);
  }

  update(
    userId: number,
    userInformation: Partial<Child>,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(userId, userInformation);
  }
}
