import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type UserLocal = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: 'john',
      email: 'john@gmail.com',
      password: '123456',
    },
    {
      id: 2,
      name: 'maria',
      email: 'maria@gmail.com',
      password: 'guess',
    },
  ];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneLocal(name: string): Promise<UserLocal | undefined> {
    console.log(name);
    console.log(this.users);

    return this.users.find((user) => user.name === name);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
