import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateChildDto } from './dtos/create-child.dto';
import { Gender } from '../../enums/gender.enum';
import { User } from '../user/entities/user.entity';
import { UpdateChildDto } from './dtos/update-child.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UsersService } from '../user/users.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childrenRepository: Repository<Child>,
    private readonly fileUploadService: FileUploadService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
  }

  findAll(): Promise<Child[]> {
    return this.childrenRepository.find({
      relations: ['mother', 'father'],
    });
  }

  findAllByUserId(userId: number, manager?: EntityManager): Promise<Child[]> {
    const repo = manager ? manager.getRepository(Child) : this.childrenRepository;
    return repo.find({
      where: [{ mother: { id: userId } }, { father: { id: userId } }],
      relations: ['mother', 'father'],
    });
  }

  async findOneById(id: number, manager?: EntityManager): Promise<Child | null> {
    const repo = manager ? manager.getRepository(Child) : this.childrenRepository;
    const child = await repo.findOne({
      where: { id },
      relations: ['mother', 'father'],
    });
    if (!child) {
      throw new NotFoundException('Child not found');
    }
    return child;
  }

  async createChild(
    createChildDto: CreateChildDto,
    userId: number,
    file: Express.Multer.File,
    req: any,
  ): Promise<Child> {
    try {
      const user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (file) {
        createChildDto.avatarUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
      }
      const child = this.childrenRepository.create({
        ...createChildDto,
        mother: user.gender === 'female' ? user : null,
        father: user.gender === 'male' ? user : null,
      });
      return this.childrenRepository.save(child);
    } catch (e) {
      if (file) {
        await this.fileUploadService.deleteFile(file.path);
      }
      throw e;
    }
  }

  async updateChild(
    id: number,
    updateChildDto: UpdateChildDto,
    userId: number,
    file: Express.Multer.File,
    req: any,
  ): Promise<Child> {
    try {
      const currentChild = await this.findOneById(id);
      const user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (file) {
        if (currentChild.avatarUrl) {
          this.fileUploadService.deleteFile(currentChild.avatarUrl);
        }
        updateChildDto.avatarUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
      }
      const updatedChild = { ...currentChild, ...updateChildDto };
      return this.childrenRepository.save(updatedChild);
    } catch (e) {
      if (file) {
        await this.fileUploadService.deleteFile(file.path);
      }
      throw e;
    }
  }

  async deleteChild(
    id: number,
    userId: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repoUser = manager ? manager.getRepository(User) : this.usersService.usersRepository;
    const repoChild = manager ? manager.getRepository(Child) : this.childrenRepository;
    const child = await this.findOneById(id, manager);
    const user = await repoUser.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      (user.gender == Gender.FEMALE &&
        child.mother != null &&
        child.mother.id !== userId) ||
      (user.gender == Gender.MALE &&
        child.father != null &&
        child.father.id !== userId)
    ) {
      throw new NotAcceptableException(
        'You are not authorized to delete this child',
      );
    }
    await repoChild.remove(child);
    if (child.avatarUrl) {
      this.fileUploadService.deleteFile(child.avatarUrl);
    }
  }
}
