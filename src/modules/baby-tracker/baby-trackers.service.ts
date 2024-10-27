import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from '../../enums/gender.enum';
import { FileUploadService } from '../file-upload/file-upload.service';
import { BabyTracker } from './entities/baby-tracker.entity';
import { MomInfo } from './entities/mom-info.entity';
import { BabyInfo } from './entities/baby-info.entity';

@Injectable()
export class BabyTrackersService {
  constructor(
    @InjectRepository(BabyTracker)
    private readonly babyTrackerRepository: Repository<BabyTracker>,
    @InjectRepository(MomInfo)
    private readonly momInfoRepository: Repository<MomInfo>,
    @InjectRepository(BabyInfo)
    private readonly babyInfoRepository: Repository<BabyInfo>,
    private fileUploadService: FileUploadService,
  ) {}

  findAll(): Promise<BabyTracker[]> {
    return this.babyTrackerRepository.find();
  }

  findAllWithRelations(): Promise<BabyTracker[]> {
    return this.babyTrackerRepository.find({
      relations: ['momInfo', 'babyInfo']
    });
  }

  findOneById(id: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOneBy({ id });
  }

  /*findOneByIdWithRelations(id: number): Promise<BabyTracker | null> {
    return await this.babyTrackerRepository.findOne({
      where: { id },
      relations: ['momInfo', 'babyInfo'], // Tải các quan hệ
    });
  }

  findOneByWeek(week: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOneBy({ week });
  }

  findOneByWeekWithRelations(week: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOneBy({ week });
  }

  async create(BabyTrackerData: Partial<BabyTracker>): Promise<BabyTrackerWithChildren> {
    const BabyTracker = this.babyTrackerRepository.create(BabyTrackerData);
    await this.babyTrackerRepository.save(BabyTracker);
    return {
      ...BabyTracker,
      partner: null,
      children: [],
    } as BabyTrackerWithChildren;
  }

  async updateBabyTracker(id: number, updateBabyTrackerDto: UpdateBabyTrackerDto): Promise<BabyTracker> {
    await this.babyTrackerRepository.update(id, updateBabyTrackerDto);
    return this.babyTrackerRepository.findOneBy({ id });
  }

  async findBabyTrackerWithPartnerAndChildrenById(
    id: number,
  ): Promise<BabyTrackerWithChildren> {
    const BabyTracker = await this.babyTrackerRepository.findOne({
      where: { id },
      relations: ['partner', 'childrenAsMother', 'childrenAsFather'],
    });
    if (!BabyTracker) {
      throw new Error('BabyTracker not found');
    }
    const children =
      BabyTracker.gender === Gender.FEMALE
        ? BabyTracker.childrenAsMother
        : BabyTracker.childrenAsFather;
    return {
      ...BabyTracker,
      children,
    } as BabyTrackerWithChildren;
  }

  async findBabyTrackerWithPartnerAndChildrenByEmail(
    email: string,
  ): Promise<BabyTrackerWithChildren> {
    const BabyTracker = await this.babyTrackerRepository.findOne({
      where: { email },
      relations: ['partner', 'childrenAsMother', 'childrenAsFather'],
    });
    if (!BabyTracker) {
      throw new Error('BabyTracker not found');
    }
    const children =
      BabyTracker.gender === Gender.FEMALE
        ? BabyTracker.childrenAsMother
        : BabyTracker.childrenAsFather;
    return {
      ...BabyTracker,
      children,
    } as BabyTrackerWithChildren;
  }

  async deleteBabyTracker(id: number): Promise<void> {
    const BabyTracker = await this.babyTrackerRepository.findOneBy({ id });
    if (!BabyTracker) {
      throw new UnauthorizedException('BabyTracker not found');
    }
    if (BabyTracker.avatarUrl) {
      this.fileUploadService.deleteFile(BabyTracker.avatarUrl);
    }
    await this.babyTrackerRepository.remove(BabyTracker);
  }*/
}
