import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicCategory } from './entities/music-category.entity';
import { MusicSong } from './entities/music-song.entity';
import { MusicCategoryDto } from './dtos/music-category.dto';

@Injectable()
export class MusicsService {
  constructor(
    @InjectRepository(MusicCategory)
    private musicCategoryRepository: Repository<MusicCategory>,
    @InjectRepository(MusicSong)
    private musicSongRepository: Repository<MusicSong>,
  ) {}

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

  async removeCategory(id: number): Promise<void> {
    const category = await this.findOneCategory(id);
    await this.musicCategoryRepository.remove(category);
  }
}
