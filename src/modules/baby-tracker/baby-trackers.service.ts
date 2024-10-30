import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from '../../enums/gender.enum';
import { FileUploadService } from '../file-upload/file-upload.service';
import { BabyTracker } from './entities/baby-tracker.entity';
import { MomInfo } from './entities/mom-info.entity';
import { BabyInfo } from './entities/baby-info.entity';
import { CreateBabyTrackerDto } from './dtos/baby-tracker.dto';
import { MomInfoDto } from './dtos/mom-info.dto';
import { BabyInfoDto } from './dtos/baby-info.dto';
import { Child } from '../children/entities/child.entity';

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

  findOneByWeekWithRelations(week: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOne({
      where: { week },
      relations: ['momInfo', 'babyInfo'],
    });
  }

  findOneByWeek(week: number): Promise<BabyTracker | null> {
    return this.babyTrackerRepository.findOneBy({ week });
  }

  /*async create(
    BabyTrackerData: Partial<BabyTracker>,
  ): Promise<BabyTrackerWithChildren> {
    const BabyTracker = this.babyTrackerRepository.create(BabyTrackerData);
    await this.babyTrackerRepository.save(BabyTracker);
    return {
      ...BabyTracker,
      partner: null,
      children: [],
    } as BabyTrackerWithChildren;
  }*/

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
    babyInfoDto.high = createBabyTrackerDto.week;
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

  /*async updateBabyTracker(
    id: number,
    updateBabyTrackerDto: UpdateBabyTrackerDto,
  ): Promise<BabyTracker> {
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
