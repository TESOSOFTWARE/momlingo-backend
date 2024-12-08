import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Checklist } from './entities/checklist.entity';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ChecklistDto } from './dtos/checklist.dto';
import { ChecklistItemDto } from './dtos/checklist-item.dto';
import { PAGINATION } from '../../constants/constants';

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
    @InjectRepository(ChecklistItem)
    private checklistItemRepository: Repository<ChecklistItem>,
  ) {
  }

  /// --- New Checklist service START ---
  async createChecklist(checklistDto: ChecklistDto): Promise<Checklist> {
    const checklist = this.checklistRepository.create(checklistDto);
    return await this.checklistRepository.save(checklist);
  }

  async updateChecklist(
    id: number,
    checklistDto: ChecklistDto,
  ): Promise<Checklist> {
    await this.checklistRepository.update(id, checklistDto);
    return this.checklistRepository.findOneBy({ id });
  }

  async findAllChecklistByUserId(userId: number, currentPage: number, currentTime: boolean) {
    const limit = PAGINATION.LIMIT;
    const skip = (currentPage - 1) * limit;
    const query = this.checklistRepository.createQueryBuilder('checklist')
      .where('checklist.userId = :userId', { userId })
      .skip(skip)
      .take(limit)
      .orderBy('checklist.startDate', 'ASC');

    if (currentTime) {
      query.andWhere('CAST(checklist.endDate AS DATE) >= CAST(:currentDate AS DATE)', { currentDate: new Date() });
    }

    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async findOneChecklist(id: number): Promise<Checklist> {
    const checklist = await this.checklistRepository.findOneBy({ id });
    if (!checklist) {
      throw new NotFoundException(`Checklist with ID ${id} not found`);
    }
    return checklist;
  }

  async findChecklistByName(name: string): Promise<Checklist[]> {
    return this.checklistRepository
      .createQueryBuilder('checklist')
      .where('LOWER(checklist.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .getMany();
  }

  async deleteChecklistAndChecklistItem(checklistId: number): Promise<void> {
    const checklist = await this.checklistRepository.findOne({ where: { id: checklistId } });
    if (!checklist) {
      throw new NotFoundException(`Checklist with ID ${checklistId} not found`);
    }
    await this.checklistRepository.delete(checklistId);
  }

  /// --- New Checklist service END ---

  /// --- ChecklistItem service START ---
  async createChecklistItem(checklistItemDto: ChecklistItemDto): Promise<ChecklistItem> {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistItemDto.checklistId },
    });
    if (!checklist) {
      throw new UnauthorizedException('Checklist not found');
    }
    const checklistItem = this.checklistItemRepository.create({
      ...checklistItemDto,
      checklist,
    });
    return await this.checklistItemRepository.save(checklistItem);
  }

  async updateChecklistItem(id: number, checklistItemDto: ChecklistItemDto): Promise<ChecklistItem> {
    await this.checklistItemRepository.update(id, checklistItemDto);
    return this.checklistItemRepository.findOneBy({ id });
  }

  async findAllChecklistItem(): Promise<ChecklistItem[]> {
    return this.checklistItemRepository.find();
  }

  async findOneChecklistItem(id: number): Promise<ChecklistItem> {
    const checklistItem = await this.checklistItemRepository.findOneBy({ id });
    if (!checklistItem) {
      throw new NotFoundException(`ChecklistItem with ID ${id} not found`);
    }
    return checklistItem;
  }

  async findAllChecklistItemByChecklistId(checklistId: number): Promise<ChecklistItem[]> {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });
    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    return this.checklistItemRepository.find({
      where: { checklist: { id: checklistId } },
      relations: ['checklist'],
    });
  }

  async removeChecklistItem(id: number): Promise<void> {
    const checklistItem = await this.findOneChecklistItem(id);
    await this.checklistItemRepository.remove(checklistItem);
  }

  /// --- ChecklistItem service END ---
}
