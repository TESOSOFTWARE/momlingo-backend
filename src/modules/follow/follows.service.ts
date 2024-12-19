import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Follow một người dùng
  async follow(followerId: number, followedId: number): Promise<Follow> {
    // Kiểm tra xem người dùng đã follow chưa
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    if (existingFollow) {
      throw new Error('You are already following this user.');
    }

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });
    const followed = await this.userRepository.findOne({
      where: { id: followedId },
    });

    if (!follower || !followed) {
      throw new NotFoundException('User not found.');
    }

    const follow = new Follow();
    follow.follower = follower;
    follow.followed = followed;

    return this.followRepository.save(follow);
  }

  // Unfollow một người dùng
  async unfollow(followerId: number, followedId: number): Promise<void> {
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    if (!existingFollow) {
      throw new Error('You are not following this user.');
    }

    await this.followRepository.remove(existingFollow);
  }
}
