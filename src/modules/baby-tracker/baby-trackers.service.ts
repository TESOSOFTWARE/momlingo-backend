import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { BabyTracker } from './entities/baby-tracker.entity';
import { MomInfo } from './entities/mom-info.entity';
import { BabyInfo } from './entities/baby-info.entity';
import {
  CreateBabyTrackerDto,
  UpdateBabyTrackerDto,
} from './dtos/baby-tracker.dto';
import { MomInfoDto } from './dtos/mom-info.dto';
import { BabyInfoDto } from './dtos/baby-info.dto';

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

  findAllWithRelations(): Promise<BabyTracker[]> {
    return this.babyTrackerRepository.find({
      relations: ['momInfo', 'babyInfo'],
    });
  }

  findOneByIdWithRelations(id: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOne({
      where: { id },
      relations: ['momInfo', 'babyInfo'],
    });
  }

  async findOneByWeekWithRelations(week: number): Promise<BabyTracker | null> {
    const babyTracker = await this.babyTrackerRepository.findOne({
      where: { week },
      relations: ['momInfo', 'babyInfo'],
    });
    if (!babyTracker) {
      throw new NotFoundException(`BabyTracker with week ${week} not found`);
    }
    return babyTracker;
  }

  findOneByWeek(week: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOneBy({ week });
  }

  async create(
    createBabyTrackerDto: CreateBabyTrackerDto,
  ): Promise<BabyTracker> {
    const momInfoDto = new MomInfoDto();
    momInfoDto.week = createBabyTrackerDto.week;
    momInfoDto.thumbnail3DUrl = createBabyTrackerDto.thumbnail3DUrlMom;
    momInfoDto.image3DUrl = createBabyTrackerDto.image3DUrlMom;
    momInfoDto.symptoms = createBabyTrackerDto.symptoms;
    momInfoDto.thingsTodo = createBabyTrackerDto.thingsTodo;
    momInfoDto.thingsToAvoid = createBabyTrackerDto.thingsToAvoid;
    const momInfo = this.momInfoRepository.create(momInfoDto);
    const savedMomInfo = await this.momInfoRepository.save(momInfo);

    const babyInfoDto = new BabyInfoDto();
    babyInfoDto.week = createBabyTrackerDto.week;
    babyInfoDto.weight = createBabyTrackerDto.weight;
    babyInfoDto.high = createBabyTrackerDto.high;
    babyInfoDto.thumbnail3DUrl = createBabyTrackerDto.thumbnail3DUrlBaby;
    babyInfoDto.image3DUrl = createBabyTrackerDto.image3DUrlBaby;
    babyInfoDto.symbolicImageUrl = createBabyTrackerDto.symbolicImageUrl;
    babyInfoDto.sizeShortDescription =
      createBabyTrackerDto.sizeShortDescription;
    babyInfoDto.babyOverallInfo = createBabyTrackerDto.babyOverallInfo;
    babyInfoDto.babySizeInfo = createBabyTrackerDto.babySizeInfo;
    const babyInfo = this.babyInfoRepository.create(babyInfoDto);
    const savedBabyInfo = await this.babyInfoRepository.save(babyInfo);

    const babyTrackerDto = {
      week: createBabyTrackerDto.week,
      keyTakeaways: createBabyTrackerDto.keyTakeaways,
      momInfo: savedMomInfo,
      babyInfo: savedBabyInfo,
    };
    const babyTracker = this.babyTrackerRepository.create(babyTrackerDto);

    return this.babyTrackerRepository.save(babyTracker);
  }

  async update(
    existingTracker: BabyTracker,
    updateBabyTrackerDto: UpdateBabyTrackerDto,
  ): Promise<BabyTracker> {
    const momInfoDto = existingTracker.momInfo;
    if (updateBabyTrackerDto.thumbnail3DUrlMom) {
      momInfoDto.thumbnail3DUrl = updateBabyTrackerDto.thumbnail3DUrlMom;
    }
    if (updateBabyTrackerDto.image3DUrlMom) {
      momInfoDto.image3DUrl = updateBabyTrackerDto.image3DUrlMom;
    }
    if (updateBabyTrackerDto.symptoms) {
      momInfoDto.symptoms = updateBabyTrackerDto.symptoms;
    }
    if (updateBabyTrackerDto.thingsTodo) {
      momInfoDto.thingsTodo = updateBabyTrackerDto.thingsTodo;
    }
    if (updateBabyTrackerDto.thingsToAvoid) {
      momInfoDto.thingsToAvoid = updateBabyTrackerDto.thingsToAvoid;
    }
    const savedMomInfo = await this.momInfoRepository.save(momInfoDto);

    const babyInfoDto = existingTracker.babyInfo;
    if (updateBabyTrackerDto.weight) {
      babyInfoDto.weight = updateBabyTrackerDto.weight;
    }
    if (updateBabyTrackerDto.high) {
      babyInfoDto.high = updateBabyTrackerDto.high;
    }
    if (updateBabyTrackerDto.thumbnail3DUrlBaby) {
      babyInfoDto.thumbnail3DUrl = updateBabyTrackerDto.thumbnail3DUrlBaby;
    }
    if (updateBabyTrackerDto.image3DUrlBaby) {
      babyInfoDto.image3DUrl = updateBabyTrackerDto.image3DUrlBaby;
    }
    if (updateBabyTrackerDto.symbolicImageUrl) {
      babyInfoDto.symbolicImageUrl = updateBabyTrackerDto.symbolicImageUrl;
    }
    if (updateBabyTrackerDto.sizeShortDescription) {
      babyInfoDto.sizeShortDescription =
        updateBabyTrackerDto.sizeShortDescription;
    }
    if (updateBabyTrackerDto.babyOverallInfo) {
      babyInfoDto.babyOverallInfo = updateBabyTrackerDto.babyOverallInfo;
    }
    if (updateBabyTrackerDto.babySizeInfo) {
      babyInfoDto.babySizeInfo = updateBabyTrackerDto.babySizeInfo;
    }
    const savedBabyInfo = await this.babyInfoRepository.save(babyInfoDto);

    if (updateBabyTrackerDto.keyTakeaways) {
      existingTracker.keyTakeaways = updateBabyTrackerDto.keyTakeaways;
    }
    existingTracker.momInfo = savedMomInfo;
    existingTracker.babyInfo = savedBabyInfo;

    return this.babyTrackerRepository.save(existingTracker);
  }

  async delete(week: number): Promise<void> {
    await this.babyTrackerRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const babyTracker = await this.findOneByWeekWithRelations(week);
        if (!babyTracker) {
          throw new NotFoundException(
            `BabyTracker with week ${week} not found`,
          );
        }

        await entityManager.delete(BabyTracker, babyTracker.id);

        if (babyTracker.momInfo) {
          await entityManager.delete(MomInfo, babyTracker.momInfo.id);
          this.fileUploadService.deleteFile(babyTracker.momInfo.thumbnail3DUrl);
        }

        if (babyTracker.babyInfo) {
          await entityManager.delete(BabyInfo, babyTracker.babyInfo.id);
          this.fileUploadService.deleteFile(
            babyTracker.babyInfo.thumbnail3DUrl,
          );
          this.fileUploadService.deleteFile(
            babyTracker.babyInfo.symbolicImageUrl,
          );
        }
      },
    );
  }
}
