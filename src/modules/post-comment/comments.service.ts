import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PAGINATION } from '../../constants/constants';
import { PostComment } from './entities/post-comment.entity';
import { CreatePostCommentDto } from './dtos/create-post-comment.dto';
import { PostsService } from '../post/posts.service';
import { NotificationsService } from '../notification/notifications.service';
import { NotificationType } from '../../enums/notification-type.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(PostComment)
    private commentRepository: Repository<PostComment>,
    private postsService: PostsService,
    private readonly notificationsService: NotificationsService,
  ) {
  }

  async findOnePostComment(id: number, manager?: EntityManager): Promise<PostComment> {
    const repo = manager ? manager.getRepository(PostComment) : this.commentRepository;
    const postComment = await repo.findOneBy({ id });
    if (!postComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return postComment;
  }

  async getAllCommentByPostId(postId: number, currentPage: number, req: any) {
    const post = await this.postsService.findOneById(postId);
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.commentRepository.findAndCount({
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

  async createComment(createPostCommentDto: CreatePostCommentDto, req: any): Promise<PostComment> {
    return this.commentRepository.manager.transaction(async (manager: EntityManager) => {
      const repo = manager.getRepository(PostComment);
      createPostCommentDto.userId = req.user.id;
      const post = await this.postsService.findOneById(createPostCommentDto.postId, manager);
      await this.postsService.updateCommentsCount(post, 'increase', manager);
      const postComment = repo.create(createPostCommentDto);
      const savedPostComment =  await repo.save(postComment);
      savedPostComment.user = req.user;
      try {
        if (post.userId != req.user.id) {
          await this.notificationsService.createOrUpdate({
            userId: post.userId,
            actorId: req.user.id,
            postId: post.id,
            type: NotificationType.COMMENT_POST,
          });
        }
      } catch (e) {
        console.log("Error", e);
      }
      return savedPostComment;
    });
  }

  async deleteCommentsById(commentId: number, req: any) {
    return this.commentRepository.manager.transaction(async (manager: EntityManager) => {
      const repo = manager.getRepository(PostComment);
      const postComment = await this.findOnePostComment(commentId, manager);
      if (postComment.userId != req.user.id) {
        throw new NotAcceptableException(`You don't have permission to delete this comment`);
      }
      const post = await this.postsService.findOneById(postComment.postId, manager);
      await this.postsService.updateCommentsCount(post, 'decrease', manager);
      await repo.remove(postComment);
    });
  }
}
