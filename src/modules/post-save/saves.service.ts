import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PAGINATION } from '../../constants/constants';
import { PostsService } from '../post/posts.service';
import { Save } from './entities/save.entity';
import { PostComment } from '../post-comment/entities/post-comment.entity';
import { NotificationsService } from '../notification/notifications.service';
import { NotificationType } from '../../enums/notification-type.enum';

@Injectable()
export class SavesService {
  constructor(
    @InjectRepository(Save)
    public saveRepository: Repository<Save>,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async findOneSave(id: number, manager?: EntityManager): Promise<Save> {
    const repo = manager
      ? manager.getRepository(PostComment)
      : this.saveRepository;
    const postLike = await repo.findOneBy({ id });
    if (!postLike) {
      throw new NotFoundException(`Save with ID ${id} not found`);
    }
    return postLike;
  }

  async savePost(postId: number, req: any) {
    return this.saveRepository.manager.transaction(
      async (manager: EntityManager) => {
        const repo = manager.getRepository(Save);
        const post = await this.postsService.findOneById(postId, manager);
        const save = await repo.findOneBy({ postId, userId: req.user.id });
        if (!save) {
          await this.postsService.updateSavesCount(post, 'increase', manager);
          const postSave = repo.create({ postId, userId: req.user.id });
          await repo.save(postSave);
          try {
            if (post.userId != req.user.id) {
              this.notificationsService.createOrUpdate({
                userId: post.userId,
                actorId: req.user.id,
                postId: post.id,
                type: NotificationType.SAVE_POST,
              });
            }
          } catch (e) {
            console.log('Error', e);
          }
        }
      },
    );
  }

  async unSavePost(postId: number, req: any) {
    return this.saveRepository.manager.transaction(
      async (manager: EntityManager) => {
        const repo = manager.getRepository(Save);
        const post = await this.postsService.findOneById(postId, manager);
        await this.postsService.updateSavesCount(post, 'decrease', manager);
        const save = await repo.findOneBy({ postId, userId: req.user.id });
        if (save) {
          await repo.remove(save);
        }
      },
    );
  }

  async getAllSaveByPostId(postId: number, currentPage: number, req: any) {
    const post = await this.postsService.findOneById(postId);
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.saveRepository.findAndCount({
      where: { postId: post.id },
      relations: ['user'],
      skip: (currentPage - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async hasUserSavedPost(postId: number, userId: number): Promise<boolean> {
    // Kiểm tra trong bảng saves xem có bản ghi nào khớp với postId và userId không
    const save = await this.saveRepository.findOne({
      where: { postId, userId },
    });

    return save !== null; // Nếu tìm thấy bản ghi, trả về true, ngược lại false
  }
}
