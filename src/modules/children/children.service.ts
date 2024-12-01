import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Child } from './entities/child.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChildDto } from './dtos/create-child.dto';
import { Gender } from '../../enums/gender.enum';
import { User } from '../user/entities/user.entity';
import { UpdateChildDto } from './dtos/update-child.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private childrenRepository: Repository<Child>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private fileUploadService: FileUploadService,
  ) {
  }

  findAll(): Promise<Child[]> {
    return this.childrenRepository.find();
  }

  findAllByUserId(userId: number): Promise<Child[]> {
    return this.childrenRepository.find({
      where: [{ mother: { id: userId } }, { father: { id: userId } }],
    });
  }

  async findOneById(id: number): Promise<Child | null> {
    const child = await this.childrenRepository.findOneBy({ id });
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
      const user = await this.usersRepository.findOne({ where: { id: userId } });
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
      const user = await this.usersRepository.findOne({ where: { id: userId } });
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
    req: any,
  ): Promise<Child> {
    const userId = req.user.id;
    const child = await this.findOneById(id);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      (child.gender == Gender.FEMALE &&
        child.mother != null &&
        child.mother.id !== userId) ||
      (child.gender == Gender.MALE &&
        child.father != null &&
        child.father.id !== userId)
    ) {
      throw new NotAcceptableException(
        'You are not authorized to delete this child',
      );
    }
    if (child.avatarUrl) {
      this.fileUploadService.deleteFile(child.avatarUrl);
    }
    return this.childrenRepository.remove(child);
  }
}
