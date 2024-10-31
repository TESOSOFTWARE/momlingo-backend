import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChildTrackersService } from './child-trackers.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChildTracker } from './entities/child-tracker.entity';
import { ChildTrackerDto } from './dtos/child-tracker.dto';

@ApiTags('Child Trackers')
@Controller('child-trackers')
@ApiBearerAuth()
@ApiResponse({
  status: 400,
  description:
    'Lỗi 400 hoặc các lỗi khác sẽ trả về dạng: {\n' +
    '    "message": "User not found",\n' +
    '    "statusCode": 500,\n' +
    '    "error"": "Internal server error"\n' +
    '}',
})
@UseGuards(JwtGuard)
export class ChildTrackersController {
  constructor(private readonly childTrackersService: ChildTrackersService) {}

  @Post()
  @ApiBody({ type: ChildTrackerDto })
  @ApiOperation({
    summary: 'Tạo Child Tracker',
  })
  create(
    @Body() createChildTrackerDto: ChildTrackerDto,
  ): Promise<ChildTracker> {
    return this.childTrackersService.create(createChildTrackerDto);
  }

  @Get('week/:week')
  @ApiOperation({
    summary: 'Lấy child tracker theo tuần',
  })
  findOneByWeek(@Param('week') week: number): Promise<ChildTracker> {
    return this.childTrackersService.findOneByWeek(week);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả child tracker',
  })
  findAll(): Promise<ChildTracker[]> {
    return this.childTrackersService.findAll();
  }

  @Put()
  @ApiBody({ type: ChildTrackerDto })
  @ApiOperation({
    summary: 'Chỉnh sửa child tracker theo tuần',
  })
  update(
    @Body() createChildTrackerDto: ChildTrackerDto,
  ): Promise<ChildTracker> {
    return this.childTrackersService.updateByWeek(
      createChildTrackerDto.week,
      createChildTrackerDto,
    );
  }

  @Delete('week/:week')
  @ApiOperation({
    summary: 'Xoá child tracker theo tuần',
  })
  remove(@Param('week') week: number): Promise<void> {
    return this.childTrackersService.removeByWeek(week);
  }
}
