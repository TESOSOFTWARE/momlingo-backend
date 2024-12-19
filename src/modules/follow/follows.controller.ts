import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FollowsService } from './follows.service';

@ApiTags('Follows')
@Controller('follows')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class FollowsController {
  constructor(private readonly followService: FollowsService) {}

  @Post(':followedId')
  @ApiOperation({ summary: 'Theo dõi user' })
  @ApiQuery({
    name: 'followedId',
    required: true,
    description: 'Id của user muốn theo dõi',
    type: Number,
    example: 1,
  })
  async follow(@Param('followedId') followedId: number, @Req() req: any) {
    const followerId = req.user.id;
    return this.followService.follow(followerId, followedId);
  }

  @Delete(':followedId')
  @ApiOperation({ summary: 'Bỏ theo dõi user' })
  @ApiQuery({
    name: 'followedId',
    required: true,
    description: 'Id của user muốn bỏ theo dõi',
    type: Number,
    example: 1,
  })
  async unfollow(@Param('followedId') followedId: number, @Req() req: any) {
    const followerId = req.user.id;
    return this.followService.unfollow(followerId, followedId);
  }
}
