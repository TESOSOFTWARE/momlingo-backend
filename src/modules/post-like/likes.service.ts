import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PAGINATION } from '../../constants/constants';
import { PostsService } from '../post/posts.service';
import { Like as PostLike } from './entities/like.entity' ;
import { PostComment } from '../post-comment/entities/post-comment.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(PostLike)
    private likeRepository: Repository<PostLike>,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {
  }

  async findOnePostLike(id: number, manager?: EntityManager): Promise<PostLike> {
    const repo = manager ? manager.getRepository(PostComment) : this.likeRepository;
    const postLike = await repo.findOneBy({ id });
    if (!postLike) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }
    return postLike;
  }

  async likePost(postId: number, req: any) {
    return this.likeRepository.manager.transaction(async (manager: EntityManager) => {
      const repo = manager.getRepository(PostLike);
      const post = await this.postsService.findOneById(postId, manager);
      const like = await repo.findOneBy({ postId, userId: req.user.id });
      if (!like) {
        await this.postsService.updateLikesCount(post, 'increase', manager);
        const postLike = repo.create({ postId, userId: req.user.id });
        await repo.save(postLike);
      }
    });
  }

  async unlikePost(postId: number, req: any) {
    return this.likeRepository.manager.transaction(async (manager: EntityManager) => {
      const repo = manager.getRepository(PostLike);
      const post = await this.postsService.findOneById(postId, manager);
      await this.postsService.updateLikesCount(post, 'decrease', manager);
      const like = await repo.findOneBy({ postId, userId: req.user.id });
      if (like) {
        await repo.remove(like);
      }
    });
  }

  async getAllLikeByPostId(postId: number, currentPage: number, req: any) {
    const post = await this.postsService.findOneById(postId);
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.likeRepository.findAndCount({
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

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    // Kiểm tra trong bảng Likes xem có bản ghi nào khớp với postId và userId không
    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    return like !== null;  // Nếu tìm thấy bản ghi, trả về true, ngược lại false
  }
}
