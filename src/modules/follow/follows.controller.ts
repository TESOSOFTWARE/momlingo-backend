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
  async follow(@Param('followedId') followedId: number, @Req() req: any) {
    const followerId = req.user.id;
    return this.followService.follow(followerId, followedId);
  }

  @Delete(':followedId')
  @ApiOperation({ summary: 'Bỏ theo dõi user' })
  async unfollow(@Param('followedId') followedId: number, @Req() req: any) {
    const followerId = req.user.id;
    return this.followService.unfollow(followerId, followedId);
  }
}
