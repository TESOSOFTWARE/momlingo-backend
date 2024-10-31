import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildTracker } from './entities/child-tracker.entity';
import { ChildTrackerDto } from './dtos/child-tracker.dto';

@Injectable()
export class ChildTrackersService {
  constructor(
    @InjectRepository(ChildTracker)
    private childTrackerRepository: Repository<ChildTracker>,
  ) {}

  async create(createChildTrackerDto: ChildTrackerDto): Promise<ChildTracker> {
    const existingChildTracker = await this.childTrackerRepository.findOneBy({
      week: createChildTrackerDto.week,
    });
    if (existingChildTracker) {
      throw new NotFoundException(
        `ChildTracker with week ${createChildTrackerDto.week} has existed`,
      );
    }
    const childTracker = this.childTrackerRepository.create(
      createChildTrackerDto,
    );
    return this.childTrackerRepository.save(childTracker);
  }

  async findAll(): Promise<ChildTracker[]> {
    return this.childTrackerRepository.find();
  }

  async findOne(id: number): Promise<ChildTracker> {
    const childTracker = await this.childTrackerRepository.findOneBy({ id });
    if (!childTracker) {
      throw new NotFoundException(`ChildTracker with ID ${id} not found`);
    }
    return childTracker;
  }

  async update(
    id: number,
    createChildTrackerDto: ChildTrackerDto,
  ): Promise<ChildTracker> {
    await this.findOne(id);
    await this.childTrackerRepository.update(id, createChildTrackerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.childTrackerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ChildTracker with ID ${id} not found`);
    }
  }

  async findOneByWeek(week: number): Promise<ChildTracker> {
    const childTracker = await this.childTrackerRepository.findOneBy({ week });
    if (!childTracker) {
      throw new NotFoundException(`ChildTracker with week ${week} not found`);
    }
    return childTracker;
  }

  async updateByWeek(
    week: number,
    createChildTrackerDto: ChildTrackerDto,
  ): Promise<ChildTracker> {
    const childTracker = await this.findOneByWeek(week);
    if (!childTracker) {
      throw new NotFoundException(`ChildTracker with week ${week} not found`);
    }
    await this.childTrackerRepository.update(
      childTracker.id,
      createChildTrackerDto,
    );
    return this.findOneByWeek(week);
  }

  async removeByWeek(week: number): Promise<void> {
    const childTracker = await this.findOneByWeek(week);
    if (!childTracker) {
      throw new NotFoundException(`ChildTracker with week ${week} not found`);
    }
    await this.childTrackerRepository.delete(childTracker.id);
  }
}
