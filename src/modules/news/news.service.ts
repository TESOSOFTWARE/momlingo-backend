import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { NewCategory } from './entities/new-category.entity';
import { News } from './entities/news.entity';
import { NewCategoryDto } from './dtos/new-category.dto';
import { NewsDto } from './dtos/news.dto';
import { PAGINATION } from '../../constants/constants';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewCategory)
    private newCategoryRepository: Repository<NewCategory>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private readonly fileUploadsService: FileUploadService,
  ) {
  }

  /// --- New Category service START ---
  async createCategory(categoryDto: NewCategoryDto): Promise<NewCategory> {
    const category = this.newCategoryRepository.create(categoryDto);
    return await this.newCategoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    categoryDto: NewCategoryDto,
  ): Promise<NewCategory> {
    await this.newCategoryRepository.update(id, categoryDto);
    return this.newCategoryRepository.findOneBy({ id });
  }

  async findAllCategory(): Promise<NewCategory[]> {
    return this.newCategoryRepository.find();
  }

  async findOneCategory(id: number): Promise<NewCategory> {
    const category = await this.newCategoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findCategoryByName(name: string): Promise<NewCategory[]> {
    return this.newCategoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .getMany();
  }

  async deleteCategoryAndNews(categoryId: number): Promise<void> {
    const queryRunner: QueryRunner =
      this.newCategoryRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const category = (await queryRunner.manager.findOne(NewCategory, {
        where: { id: categoryId },
      })) as NewCategory;
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      // Lấy danh sách tin tức liên quan đến category
      const newsList = (await queryRunner.manager.find(News, {
        where: { category: { id: categoryId } },
      })) as News[];

      // Xoá tất cả tin tức liên quan đến category
      await queryRunner.manager.delete(News, {
        category: { id: categoryId },
      });

      // Xoá category
      await queryRunner.manager.delete(NewCategory, categoryId);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Xoá file ảnh của từng tin tức
      for (const news of newsList) {
        if (news.thumbnailUrl) {
          this.fileUploadsService.deleteFile(news.thumbnailUrl);
        }
      }
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Giải phóng QueryRunner
      await queryRunner.release();
    }
  }

  /// --- New Category service END ---

  /// --- News service START ---
  async createNews(newsDto: NewsDto): Promise<News> {
    const category = await this.newCategoryRepository.findOne({
      where: { id: newsDto.categoryId },
    });
    if (!category) {
      throw new UnauthorizedException('Category not found');
    }
    const news = this.newsRepository.create({
      ...newsDto,
      category,
    });
    return await this.newsRepository.save(news);
  }

  async updateNews(id: number, newsDto: NewsDto): Promise<News> {
    await this.newsRepository.update(id, newsDto);
    return this.newsRepository.findOneBy({ id });
  }

  async findAllNews(currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.newsRepository.findAndCount({
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

  async findOneNews(id: number): Promise<News> {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async findAllNewsByCategoryId(categoryId: number, currentPage: number) {
    const category = await this.newCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.newsRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
      where: { category: { id: categoryId } },
      relations: ['category'],
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async findNewsByTitle(title: string, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const skip = (currentPage - 1) * limit;
    return this.newsRepository
      .createQueryBuilder('news')
      .where('LOWER(news.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      })
      .skip(skip)
      .take(currentPage)
      .getManyAndCount();
  }

  async removeNews(id: number): Promise<void> {
    const song = await this.findOneNews(id);
    await this.newsRepository.remove(song);
  }

  /// --- Song service END ---
}
