import {
  Body,
  Controller,
  Get,
  Param, Patch,
  Post,
  Query, Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create noti' })
  async createOrUpdate(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createOrUpdate(createNotificationDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy danh sách noti của user id' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async getAllNotificationsByUserId(
    @Param('userId') userId: number,
    @Query('currentPage') currentPage = 1,
    @Req() req: any,
  ) {
    const pageNumber = Number(currentPage);
    return this.notificationsService.findAllByUserId(userId, pageNumber);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đổi trạng thái sang đã đọc của noti item' })
  async markAsRead(@Param('id') id: number) {
    return this.notificationsService.markAsRead(id);
  }
}
