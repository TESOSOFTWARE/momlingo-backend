import { forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { TagsService } from '../post-tag/tags.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Tag } from '../post-tag/entities/tag.entity';
import { PostStatus } from '../../enums/post-status.enum';
import { PAGINATION } from '../../constants/constants';
import { LikesService } from '../post-like/likes.service';
import { SavesService } from '../post-save/saves.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    readonly postImageRepository: Repository<PostImage>,
    readonly tagsService: TagsService,
    @Inject(forwardRef(() => LikesService))
    private readonly likesService: LikesService,
    @Inject(forwardRef(() => SavesService))
    private readonly savesService: SavesService,
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

  async getPostDetail(id: number, req: any) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images', 'tags', 'user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const liked = await this.likesService.hasUserLikedPost(id, req.user.id);
    const saved = await this.likesService.hasUserLikedPost(id, req.user.id);

    return {
      ...post,
      liked,
      saved,
    };
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

  async deletePost(postId: number, req: any, inputManager?: EntityManager) {
    return this.postRepository.manager.transaction(async (entityManager: EntityManager) => {
      const manager = inputManager ? inputManager : entityManager;
      const userId = req.user.id;
      const repo = manager.getRepository(Post);
      const post = await repo.findOne({
        where: { id: postId },
        relations: ['images'],
      });
      if (userId != post.userId) {
        throw new NotAcceptableException('You do not have permission to delete post');
      }
      await repo.remove(post);
      if (post.images.length > 0) {
        const postFolder = this.fileUploadService.getFolderPathFromUrl(post.images[0].imageUrl);
        await this.fileUploadService.deleteFolder(postFolder);
      }
    });
  }

  async findAllMyPost(req: any, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.postRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
      where: { userId: req.user.id },
      relations: ['images', 'tags', 'user'],
      order: {
        createdAt: 'DESC',  // Sắp xếp theo ngày tạo từ gần nhất đến lâu nhất
      },
    });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra liked và saved cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        // Kiểm tra liked và saved cho mỗi bài viết
        const liked = await this.likesService.hasUserLikedPost(post.id, req.user.id);
        const saved = await this.savesService.hasUserSavedPost(post.id, req.user.id);

        // Thêm thông tin liked và saved vào bài viết
        return {
          ...post,
          liked,
          saved,
        };
      }),
    );

    // Trả về kết quả với thông tin bổ sung
    return {
      data: postsWithAdditionalInfo,
      total,
      totalPages,
      currentPage,
    };
  }

  async findAllPostOfGuest(userId: number, req: any, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.postRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
      where: { userId: userId, status: PostStatus.PUBLIC },
      relations: ['images', 'tags', 'user'],
      order: {
        createdAt: 'DESC',  // Sắp xếp theo ngày tạo từ gần nhất đến lâu nhất
      },
    });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra liked và saved cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        // Kiểm tra liked và saved cho mỗi bài viết
        const liked = await this.likesService.hasUserLikedPost(post.id, req.user.id);
        const saved = await this.savesService.hasUserSavedPost(post.id, req.user.id);

        // Thêm thông tin liked và saved vào bài viết
        return {
          ...post,
          liked,
          saved,
        };
      }),
    );

    // Trả về kết quả với thông tin bổ sung
    return {
      data: postsWithAdditionalInfo,
      total,
      totalPages,
      currentPage,
    };
  }

  async findAllPostOnNewFeed(req: any, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.postRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
      relations: ['images', 'tags', 'user'],
      order: {
        createdAt: 'DESC',  // Sắp xếp theo ngày tạo từ gần nhất đến lâu nhất
      },
    });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra liked và saved cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        // Kiểm tra liked và saved cho mỗi bài viết
        const liked = await this.likesService.hasUserLikedPost(post.id, req.user.id);
        const saved = await this.savesService.hasUserSavedPost(post.id, req.user.id);

        // Thêm thông tin liked và saved vào bài viết
        return {
          ...post,
          liked,
          saved,
        };
      }),
    );

    // Trả về kết quả với thông tin bổ sung
    return {
      data: postsWithAdditionalInfo,
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
