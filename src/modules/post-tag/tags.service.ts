import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PAGINATION } from '../../constants/constants';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {
  }

  async createTags(names: string[]): Promise<Tag[]> {
    const existingTags = await this.tagRepository.find({
      where: names.map(name => ({ name })),
    });

    const existingTagNames = existingTags.map(tag => tag.name);
    const newTagNames = names.filter(name => !existingTagNames.includes(name));
    const newTags = newTagNames.map((name) => {
      const tag = new Tag();
      tag.name = name;
      return tag;
    });
    const createdTags = await this.tagRepository.save(newTags);

    return [...existingTags, ...createdTags];
  }

  async searchTags(query: string, currentPage: number = 1) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.tagRepository.findAndCount({
      where: { name: Like(`%${query}%`) },
      skip: (currentPage - 1) * limit,
      take: limit,
      order: {
        name: 'ASC',
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

}
