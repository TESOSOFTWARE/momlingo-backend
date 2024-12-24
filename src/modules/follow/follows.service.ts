import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../user/entities/user.entity';
import { PAGINATION } from '../../constants/constants';
import { NotificationsService } from '../notification/notifications.service';
import { NotificationType } from '../../enums/notification-type.enum';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
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

    const followSaved = await this.followRepository.save(follow);
    try {
      await this.notificationsService.createOrUpdate({
        userId: followedId,
        actorId: followerId,
        postId: null,
        type: NotificationType.FOLLOW,
      });
    } catch (e) {
      console.log("Error", e);
    }
    return followSaved;
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

  async getAllFollowers(userId: number, manager?: EntityManager): Promise<any> {
    const repo = manager ? manager.getRepository(Follow) : this.followRepository;
    const follows = await repo.find({
      where: { followed: { id: userId } },
      relations: ['follower'],
    });
    return follows.map(follow => follow.follower);
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

  async getFollowersCount(userId: number): Promise<any> {
    const followersCount = await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followedId = :userId', { userId })
      .getCount();

    return followersCount; // Trả về tổng số người đang theo dõi userId
  }

  async getFollowedUsersCount(userId: number): Promise<any> {
    const followedCount = await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followerId = :userId', { userId })
      .getCount();

    return followedCount; // Trả về tổng số người mà userId đang theo dõi
  }
}
