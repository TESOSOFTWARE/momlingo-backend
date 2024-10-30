import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { BabyTrackersService } from '../baby-trackers.service';
import { CreateBabyTrackerDto } from '../dtos/baby-tracker.dto';

@Injectable()
export class WeekGuard implements CanActivate {
  constructor(private readonly babyTrackersService: BabyTrackersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // TODO later Request Body: {}
    console.log('Request Body:', request.body);
    console.log('Request request:', request.path);

    const createBabyTrackerDto: CreateBabyTrackerDto = request.body;
    console.log('request', request.body);
    const week = createBabyTrackerDto.week;
    if (!this.isValidWeek(week)) {
      throw new BadRequestException('Invalid week provided.');
    }

    const existingTracker = await this.babyTrackersService.findOneByWeek(week);
    if (existingTracker) {
      throw new BadRequestException(`Week ${week} already exists.`);
    }

    return true;
  }

  private isValidWeek(week: number): boolean {
    console.log('week', week);
    console.log('isValidWeek', week >= 1 && week <= 40);
    return week >= 1 && week <= 40;
  }
}
