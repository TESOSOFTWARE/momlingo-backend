import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { TagsService } from '../post-tag/tags.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Tag } from '../post-tag/entities/tag.entity';
import { PostStatus } from '../../enums/post-status.enum';
import { NewCategory } from '../news/entities/new-category.entity';
import { PAGINATION } from '../../constants/constants';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    readonly postImageRepository: Repository<PostImage>,
    readonly tagsService: TagsService,
    private readonly fileUploadService: FileUploadService,
  ) {
  }

  async findOneById(id: number, manager?: EntityManager): Promise<Post | null> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    const post = await repo.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async createPost(req: any, createPostDto: CreatePostDto, files?: Express.Multer.File[]): Promise<Post> {
    return this.postRepository.manager.transaction(async (manager: EntityManager) => {
      try {
        const userId = req.user.id;
        const postRepo = manager.getRepository(Post);

        let postData: {
          content: string;
          userId: number;
          status: PostStatus;
          enableComment: boolean;
          tags?: Tag[];
        } = {
          content: createPostDto.content,
          userId: userId,
          status: createPostDto.status,
          enableComment: createPostDto.enableComment,
        };

        if ((createPostDto.tags ?? []).length > 0) {
          const tags = await this.tagsService.createTags(createPostDto.tags, manager);
          postData = { ...postData, tags };
        }

        const post = postRepo.create(postData);
        const savedPost = await postRepo.save(post);
        const postId = savedPost.id;

        if ((files ?? []).length > 0) {
          const postImageRepo = manager.getRepository(PostImage);
          const destFolderPath = files[0].destination.replace('temps', postId.toString());

          const postImages = [];
          for (let i = 0; i < (files ?? []).length; i++) {
            const tempPath = `${req.protocol}://${req.headers.host}/${files[i].path}`;
            const savePath = tempPath.replace('temps', postId.toString());
            await this.fileUploadService.moveFile(files[i].path, destFolderPath);
            postImages.push(postImageRepo.create({
              postId: postId,
              imageUrl: savePath,
            }));
          }
          await postImageRepo.save(postImages);
        }

        return await postRepo.findOne({
          where: { id: postId },
          relations: ['images', 'tags'],
        });
      } catch (e) {
        for (let i = 0; i < (files ?? []).length; i++) {
          await this.fileUploadService.deleteFile(files[i].path);
        }
        throw e;
      }
    });
  }

  async findAllMyPost(req: any, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.postRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
      where: { userId: req.user.id },
      relations: ['images', 'tags'],
    });
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      totalPages,
      currentPage,
    };
  }

  async updateLikesCount(post: Post, action: 'increase' | 'decrease', manager?: EntityManager): Promise<Post> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    if (action === 'increase') {
      post.likesCount += 1;
    } else if (action === 'decrease' && post.likesCount > 0) {
      post.likesCount -= 1;
    }
    return await repo.save(post);
  }

  async updateCommentsCount(post: Post, action: 'increase' | 'decrease', manager?: EntityManager): Promise<Post> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    if (action === 'increase') {
      post.commentsCount += 1;
    } else if (action === 'decrease' && post.commentsCount > 0) {
      post.commentsCount -= 1;
    }
    return await repo.save(post);
  }

  async updateSavesCount(post: Post, action: 'increase' | 'decrease', manager?: EntityManager): Promise<Post> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    if (action === 'increase') {
      post.savesCount += 1;
    } else if (action === 'decrease' && post.savesCount > 0) {
      post.savesCount -= 1;
    }
    return await repo.save(post);
  }

  async increaseViewsCount(id: number, manager?: EntityManager): Promise<Post> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    const post = await this.findOneById(id, manager);
    post.viewsCount += 1;
    return await repo.save(post);
  }
}
