import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PAGINATION } from '../../constants/constants';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { Post } from '../post/entities/post.entity';
import { NotificationType } from '../../enums/notification-type.enum';
import { UsersService } from '../user/users.service';
import { PostsService } from '../post/posts.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {
  }

  async createOrUpdate(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { userId, actorId, postId, type } = createNotificationDto;
    // const notification = this.notificationRepository.create(createNotificationDto);
    // return await this.notificationRepository.save(notification);
    let notification = await this.notificationRepository.findOne({
      where: { userId, actorId, postId, type },
      relations: ['user', 'actor', 'post'],
    });
    if (notification) {
      notification.createdAt = new Date();
      notification.updatedAt = notification.createdAt;
      return this.notificationRepository.save(notification);
    } else {
      const actor = await this.usersService.findOneByIdWithoutException(createNotificationDto.actorId);
      const post = await this.postsService.findOneByIdWithoutException(createNotificationDto.postId);
      const title = createNotificationDto.type == NotificationType.SYSTEM ? createNotificationDto.title : this.getTitleFromType(createNotificationDto);
      const body = createNotificationDto.type == NotificationType.SYSTEM ? createNotificationDto.body : this.getBodyFromType(createNotificationDto, actor, post);

      notification = this.notificationRepository.create({
        ...createNotificationDto,
        title,
        body,
        readed: false,
      });

      return await this.notificationRepository.save(notification);
    }
  }

  async remove(id: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new Error('Notification not found');
    }
    await this.notificationRepository.remove(notification);
  }

  async findOneById(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Post) : this.notificationRepository;
    const noti = await repo.findOneBy({ id });
    if (!noti) {
      throw new NotFoundException('Notification not found');
    }
    return noti;
  }

  async getNotificationDetail(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Post) : this.notificationRepository;
    const notification = await repo.findOne({
      where: { id },
      relations: ['user', 'actor', 'post'],
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async findAllByUserId(userId: number, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      relations: ['user', 'actor', 'post'],
      order: {
        createdAt: 'DESC',
      },
      skip: (currentPage - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);

    return {
      data: notifications,
      total,
      totalPages,
      currentPage,
    };
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.readed = true;
    return await this.notificationRepository.save(notification);
  }

  private getTitleFromType(createNotificationDto: CreateNotificationDto): string {
    switch (createNotificationDto.type) {
      case NotificationType.SYSTEM:
        return 'Momlingo thông báo';
      case NotificationType.FOLLOW:
        return 'Theo dõi mới';
      case NotificationType.NEW_POST:
        return 'Bài viết mới';
      case NotificationType.LIKE_POST:
        return 'Lượt thích mới';
      case NotificationType.COMMENT_POST:
        return 'Bình luận mới';
      case NotificationType.SAVE_POST:
        return 'Lượt lưu mới';
      default:
        return 'Momlingo thông báo';
    }
  }

  private getBodyFromType(createNotificationDto: CreateNotificationDto, actor?: User, post?: Post): string {
    switch (createNotificationDto.type) {
      case NotificationType.SYSTEM:
        return '';
      case NotificationType.FOLLOW:
        return `${actor.name} vừa theo dõi bạn`;
      case NotificationType.NEW_POST:
        return `${actor.name} vừa đăng bài viết mới: "${post.content}"`;
      case NotificationType.LIKE_POST:
        return `${actor.name} vừa thích bài viết: "${post.content}"`;
      case NotificationType.COMMENT_POST:
        return `${actor.name} vừa bình luận bài viết: "${post.content}"`;
      case NotificationType.SAVE_POST:
        return `${actor.name} vừa lưu bài viết: "${post.content}"`;
      default:
        return '';
    }
  }

}
