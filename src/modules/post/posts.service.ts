import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
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
import { NotificationsService } from '../notification/notifications.service';
import { NotificationType } from '../../enums/notification-type.enum';
import { FollowsService } from '../follow/follows.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    public postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    readonly postImageRepository: Repository<PostImage>,
    readonly tagsService: TagsService,
    @Inject(forwardRef(() => LikesService))
    private readonly likesService: LikesService,
    @Inject(forwardRef(() => SavesService))
    private readonly savesService: SavesService,
    private readonly fileUploadService: FileUploadService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => FollowsService))
    private readonly followsService: FollowsService,
  ) {}

  async findOneByIdWithoutException(
    id?: number,
    manager?: EntityManager,
  ): Promise<Post | null> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    return await repo.findOneBy({ id });
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
    const saved = await this.savesService.hasUserSavedPost(id, req.user.id);

    return {
      ...post,
      liked,
      saved,
    };
  }

  async createPost(
    req: any,
    createPostDto: CreatePostDto,
    files?: Express.Multer.File[],
  ): Promise<Post> {
    return this.postRepository.manager.transaction(
      async (manager: EntityManager) => {
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
            const tags = await this.tagsService.createTags(
              createPostDto.tags,
              manager,
            );
            postData = { ...postData, tags };
          }

          const post = postRepo.create(postData);
          const savedPost = await postRepo.save(post);
          const postId = savedPost.id;

          if ((files ?? []).length > 0) {
            const postImageRepo = manager.getRepository(PostImage);
            const destFolderPath = files[0].destination.replace(
              'temps',
              postId.toString(),
            );

            const postImages = [];
            for (let i = 0; i < (files ?? []).length; i++) {
              const tempPath = `${req.protocol}://${req.headers.host}/${files[i].path}`;
              const savePath = tempPath.replace('temps', postId.toString());
              await this.fileUploadService.moveFile(
                files[i].path,
                destFolderPath,
              );
              postImages.push(
                postImageRepo.create({
                  postId: postId,
                  imageUrl: savePath,
                }),
              );
            }
            await postImageRepo.save(postImages);
          }

          const postSaved = await postRepo.findOne({
            where: { id: postId },
            relations: ['images', 'tags'],
          });

          try {
            this.followsService
              .getAllFollowers(userId, manager)
              .then((followers) => {
                for (const follower of followers) {
                  if (follower.id !== userId) {
                    this.notificationsService.createOrUpdate({
                      userId: follower.id,
                      actorId: userId,
                      postId: savedPost.id,
                      type: NotificationType.NEW_POST,
                    });
                  }
                }
              });
          } catch (e) {
            /* empty */
          }

          return postSaved;
        } catch (e) {
          for (let i = 0; i < (files ?? []).length; i++) {
            await this.fileUploadService.deleteFile(files[i].path);
          }
          throw e;
        }
      },
    );
  }

  async deletePost(postId: number, req: any, inputManager?: EntityManager) {
    return this.postRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const manager = inputManager ? inputManager : entityManager;
        const userId = req.user.id;
        const repo = manager.getRepository(Post);
        const post = await repo.findOne({
          where: { id: postId },
          relations: ['images'],
        });
        if (userId != post.userId) {
          throw new NotAcceptableException(
            'You do not have permission to delete post',
          );
        }
        await repo.remove(post);
        if (post.images.length > 0) {
          const postFolder = this.fileUploadService.getFolderPathFromUrl(
            post.images[0].imageUrl,
          );
          await this.fileUploadService.deleteFolder(postFolder);
        }
      },
    );
  }

  async findAllMyPost(req: any, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [data, total] = await this.postRepository.findAndCount({
      skip: (currentPage - 1) * limit,
      take: limit,
      where: { userId: req.user.id },
      relations: ['images', 'tags', 'user'],
      order: {
        createdAt: 'DESC', // Sắp xếp theo ngày tạo từ gần nhất đến lâu nhất
      },
    });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra liked và saved cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        // Kiểm tra liked và saved cho mỗi bài viết
        const liked = await this.likesService.hasUserLikedPost(
          post.id,
          req.user.id,
        );
        const saved = await this.savesService.hasUserSavedPost(
          post.id,
          req.user.id,
        );

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

  async findAllMyPostSaved(req: any, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const [savedPosts, total] =
      await this.savesService.saveRepository.findAndCount({
        where: { userId: req.user.id },
        relations: ['post'], // Lấy các bài viết đã lưu
        skip: (currentPage - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC', // Sắp xếp theo ngày lưu của bài viết
        },
      });
    const posts = savedPosts.map((save) => save.post);
    const totalPages = Math.ceil(total / limit);

    const postsWithAdditionalInfo = await Promise.all(
      posts.map(async (post) => {
        const liked = await this.likesService.hasUserLikedPost(
          post.id,
          req.user.id,
        );
        const saved = await this.savesService.hasUserSavedPost(
          post.id,
          req.user.id,
        );
        return {
          ...post,
          liked,
          saved,
        };
      }),
    );

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
        createdAt: 'DESC', // Sắp xếp theo ngày tạo từ gần nhất đến lâu nhất
      },
    });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra liked và saved cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        // Kiểm tra liked và saved cho mỗi bài viết
        const liked = await this.likesService.hasUserLikedPost(
          post.id,
          req.user.id,
        );
        const saved = await this.savesService.hasUserSavedPost(
          post.id,
          req.user.id,
        );

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
        createdAt: 'DESC', // Sắp xếp theo ngày tạo từ gần nhất đến lâu nhất
      },
    });
    const totalPages = Math.ceil(total / limit);
    // Kiểm tra liked và saved cho từng bài viết
    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        // Kiểm tra liked và saved cho mỗi bài viết
        const liked = await this.likesService.hasUserLikedPost(
          post.id,
          req.user.id,
        );
        const saved = await this.savesService.hasUserSavedPost(
          post.id,
          req.user.id,
        );

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

  async searchAllPostOnNewFeed(req: any, text: string, currentPage: number) {
    const limit = PAGINATION.LIMIT;
    const searchText = `%${text}%`;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag') // JOIN với bảng tags
      .leftJoinAndSelect('post.images', 'image')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.content LIKE :searchText', { searchText }) // Tìm trong content
      .orWhere('tag.name LIKE :searchText', { searchText }) // Tìm trong name của tag
      .skip((currentPage - 1) * limit)
      .take(limit)
      .orderBy('post.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const postsWithAdditionalInfo = await Promise.all(
      data.map(async (post) => {
        const liked = await this.likesService.hasUserLikedPost(
          post.id,
          req.user.id,
        );
        const saved = await this.savesService.hasUserSavedPost(
          post.id,
          req.user.id,
        );
        return {
          ...post,
          liked,
          saved,
        };
      }),
    );

    return {
      data: postsWithAdditionalInfo,
      total,
      totalPages,
      currentPage,
    };
  }

  async updateLikesCount(
    post: Post,
    action: 'increase' | 'decrease',
    manager?: EntityManager,
  ): Promise<Post> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    if (action === 'increase') {
      post.likesCount += 1;
    } else if (action === 'decrease' && post.likesCount > 0) {
      post.likesCount -= 1;
    }
    return await repo.save(post);
  }

  async updateCommentsCount(
    post: Post,
    action: 'increase' | 'decrease',
    manager?: EntityManager,
  ): Promise<Post> {
    const repo = manager ? manager.getRepository(Post) : this.postRepository;
    if (action === 'increase') {
      post.commentsCount += 1;
    } else if (action === 'decrease' && post.commentsCount > 0) {
      post.commentsCount -= 1;
    }
    return await repo.save(post);
  }

  async updateSavesCount(
    post: Post,
    action: 'increase' | 'decrease',
    manager?: EntityManager,
  ): Promise<Post> {
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

  async updateEnableComment(
    postId: number,
    enableComment: boolean,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    post.enableComment = enableComment;
    await this.postRepository.save(post);
    return this.postRepository.findOne({
      where: { id: post.id },
      relations: ['images', 'tags', 'user'],
    });
  }

  async updatePostStatus(postId: number, status: PostStatus): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    post.status = status;
    await this.postRepository.save(post);
    return this.postRepository.findOne({
      where: { id: post.id },
      relations: ['images', 'tags', 'user'],
    });
  }
}
