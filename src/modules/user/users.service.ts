import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWithChildren } from './interfaces/user-with-children.interface';
import { UpdateUserDto } from './dtos/update_user.dto';
import { Gender } from '../../enums/gender.enum';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private fileUploadService: FileUploadService,
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

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
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
      user.gender === Gender.FEMALE
        ? user.childrenAsMother
        : user.childrenAsFather;
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
      user.gender === Gender.FEMALE
        ? user.childrenAsMother
        : user.childrenAsFather;
    return {
      ...user,
      children,
    } as UserWithChildren;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.avatarUrl) {
      this.fileUploadService.deleteFile(user.avatarUrl);
    }
    await this.usersRepository.remove(user);
  }
}