import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../user/entities/user.entity';
import { PAGINATION } from '../../constants/constants';

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

  async isUserFollowing(
    userId: number,
    targetUserId: number,
  ): Promise<boolean> {
    const follow = await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followerId = :userId', { userId })
      .andWhere('follow.followedId = :targetUserId', { targetUserId })
      .getOne(); // Chỉ lấy một bản ghi đầu tiên thỏa mãn điều kiện

    return !!follow;
  }

  async getFollowers(userId: number, currentPage: number): Promise<any> {
    const limit = PAGINATION.LIMIT;

    const [followers, total] = await this.followRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .where('follow.followedId = :userId', { userId })
      .skip((currentPage - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: followers.map((follow) => follow.follower),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: currentPage,
    };
  }

  // Lấy danh sách những người mà userId đang theo dõi
  async getFollowedUsers(userId: number, currentPage: number): Promise<any> {
    const limit = PAGINATION.LIMIT;

    const [followedUsers, total] = await this.followRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.followed', 'followedUser')
      .where('follow.followerId = :userId', { userId })
      .skip((currentPage - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: followedUsers.map((follow) => follow.followed),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: currentPage,
    };
  }
}
