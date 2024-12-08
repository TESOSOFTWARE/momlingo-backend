import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { MusicCategory } from './entities/music-category.entity';
import { MusicSong } from './entities/music-song.entity';
import { MusicCategoryDto } from './dtos/music-category.dto';
import { MusicSongDto } from './dtos/music-song.dto';
import { MusicCategoryType } from '../../enums/music-category-type.enum';
import { FileUploadService } from '../file-upload/file-upload.service';
import { PAGINATION } from '../../constants/constants';

@Injectable()
export class MusicsService {
  constructor(
    @InjectRepository(MusicCategory)
    private musicCategoryRepository: Repository<MusicCategory>,
    @InjectRepository(MusicSong)
    private musicSongRepository: Repository<MusicSong>,
    private readonly fileUploadsService: FileUploadService,
  ) {
  }

  /// --- Category service START ---
  async createCategory(categoryDto: MusicCategoryDto): Promise<MusicCategory> {
    const category = this.musicCategoryRepository.create(categoryDto);
    return await this.musicCategoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    categoryDto: MusicCategoryDto,
  ): Promise<MusicCategory> {
    await this.musicCategoryRepository.update(id, categoryDto);
    return this.musicCategoryRepository.findOneBy({ id });
  }

  async findAllCategory(): Promise<MusicCategory[]> {
    return this.musicCategoryRepository.find();
  }

  async findOneCategory(id: number): Promise<MusicCategory> {
    const category = await this.musicCategoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findCategoryByName(name: string): Promise<MusicCategory[]> {
    return this.musicCategoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .getMany();
  }

  async deleteCategoryAndSongs(categoryId: number): Promise<void> {
    const queryRunner: QueryRunner =
      this.musicCategoryRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const category = (await queryRunner.manager.findOne(MusicCategory, {
        where: { id: categoryId },
      })) as MusicCategory;
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Lấy danh sách bài hát liên quan đến category
      const songs = (await queryRunner.manager.find(MusicSong, {
        where: { category: { id: categoryId } },
      })) as MusicSong[];

      // Xoá file nhạc của từng bài hát
      for (const song of songs) {
        if (song.fileUrl) {
          this.fileUploadsService.deleteFile(song.fileUrl);
        }
      }

      // Xoá tất cả bài hát liên quan đến category
      await queryRunner.manager.delete(MusicSong, {
        category: { id: categoryId },
      });

      // Commit transaction
      await queryRunner.commitTransaction();

      // Xoá ảnh thumbnail của category nếu có
      if (category.thumbnailUrl) {
        this.fileUploadsService.deleteFile(category.thumbnailUrl);
      }

      // Xoá category
      await queryRunner.manager.delete(MusicCategory, categoryId);
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Giải phóng QueryRunner
      await queryRunner.release();
    }
  }

  /// --- Category service END ---

  /// --- Song service START ---
  async createSong(songDto: MusicSongDto): Promise<MusicSong> {
    const category = await this.musicCategoryRepository.findOne({
      where: { id: songDto.categoryId },
    });
    if (!category) {
      throw new UnauthorizedException('Category not found');
    }
    const song = this.musicSongRepository.create({
      ...songDto,
      category,
    });
    return await this.musicSongRepository.save(song);
  }

  async updateSong(id: number, songDto: MusicSongDto): Promise<MusicSong> {
    await this.musicSongRepository.update(id, songDto);
    return this.musicSongRepository.findOneBy({ id });
  }

  async findAllSong(currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.musicSongRepository.findAndCount({
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

  async findOneSong(id: number): Promise<MusicSong> {
    const song = await this.musicSongRepository.findOneBy({ id });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  async findAllSongByCategoryId(categoryId: number, currentPage: number) {
    const category = await this.musicCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.musicSongRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ['category'],
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

  async findAllPopularSong(currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.musicSongRepository.findAndCount({
      where: { category: { type: MusicCategoryType.POPULAR } },
      relations: ['category'],
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

  async findSongByName(name: string, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const skip = (currentPage - 1) * limit;
    const [data, total] = await this.musicSongRepository
      .createQueryBuilder('song')
      .where('LOWER(song.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .skip(skip)
      .take(currentPage)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async removeSong(id: number): Promise<void> {
    const song = await this.findOneSong(id);
    await this.musicSongRepository.remove(song);
  }

  /// --- Song service END ---
}
