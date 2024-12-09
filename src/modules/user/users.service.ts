import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserWithChildren } from './interfaces/user-with-children.interface';
import { UpdateUserDto } from './dtos/update_user.dto';
import { Gender } from '../../enums/gender.enum';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ChildrenService } from '../children/children.service';
import { Child } from '../children/entities/child.entity';
import { PAGINATION } from '../../constants/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public readonly usersRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
    @Inject(forwardRef(() => ChildrenService))
    private readonly childrenService: ChildrenService,
  ) {
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUsers(currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async findOneByEmail(email: string, manager?: EntityManager): Promise<User | null> {
    const repo = manager ? manager.getRepository(User) : this.usersRepository;
    const user = await repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneById(id: number, manager?: EntityManager): Promise<User | null> {
    const repo = manager ? manager.getRepository(User) : this.usersRepository;
    const user = await repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
    req: any,
  ): Promise<User> {
    return this.usersRepository.manager.transaction(async (manager: EntityManager) => {
      try {
        const currentUser = await this.findOneById(id, manager);

        let oldAvatarUrl: string | null = null;

        if (file) {
          if (
            currentUser.avatarUrl &&
            currentUser.avatarUrl.includes(req.headers.host)
          ) {
            oldAvatarUrl = currentUser.avatarUrl;
          }

          updateUserDto.avatarUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
        }
        const updatedUser = { ...currentUser, ...updateUserDto };
        await manager.getRepository(User).update(id, updatedUser);

        try {
          if (oldAvatarUrl) {
            await this.fileUploadService.deleteFile(oldAvatarUrl);
          }
        } catch (deleteError) {
          console.error('Error deleting old avatar:', deleteError.message);
        }

        return this.getUser(req.user.id, manager);
      } catch (e) {
        if (file) {
          await this.fileUploadService.deleteFile(file.path);
        }
        throw e;
      }
    });
  }

  private async getUser(id: number, manager?: EntityManager): Promise<User> {
    return manager
      ? this.findOneById(id, manager)
      : this.findOneById(id);
  }

  async findUserWithPartnerAndChildrenById(
    id: number,
  ): Promise<UserWithChildren> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['partner', 'childrenAsMother', 'childrenAsFather'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
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
      throw new NotFoundException('User not found');
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

  async deleteUser(id: number, req: any): Promise<void> {
    return this.usersRepository.manager.transaction(async (manager: EntityManager) => {
      if(req.user.id != id) {
        throw new NotAcceptableException('You are not authorized to delete this user');
      }

      const user = await this.getUser(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const children = await this.childrenService.findAllByUserId(id);
      const repoChild = manager.getRepository(Child);
      const avatarChildList = [];
      for (const child of children) {
        if(child.avatarUrl) {
          avatarChildList.push(child.avatarUrl);
        }
        if (child.mother?.id == user.id || child.father?.id == user.id) {
          const otherParent = child.mother?.id == user.id ? child.father : child.mother;
          if (!otherParent) {
            await repoChild.remove(child);
          }
        }
      }

      await manager.remove(user);

      if (user.avatarUrl) {
        this.fileUploadService.deleteFile(user.avatarUrl);
      }
      for (const url of avatarChildList) {
        this.fileUploadService.deleteFile(url);
      }
    });
  }
}
