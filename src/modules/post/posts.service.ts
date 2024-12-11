import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { TagsService } from '../post-tag/tags.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    readonly postImageRepository: Repository<PostImage>,
    readonly tagsService: TagsService,
  ) {
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { content, status, enableComment, tags, images } = createPostDto;

    const post = this.postRepository.create({
      content,
      status: status,
      enableComment
    });

    const savedPost = await this.postRepository.save(post);

    /*// Xử lý ảnh
    if (images && images.length > 0) {
      const postImages = images.map((imageUrl) =>
        this.postImageRepository.create({
          postId: savedPost.id,
          imageUrl,
        }),
      );
      await this.postImageRepository.save(postImages);
    }*/

    return savedPost;
  }

  async createPostImageAndTags(req: any, createPostDto: CreatePostDto, images?: Express.Multer.File[], manager?: EntityManager): Promise<Post> {
    const postId = req.body.postId;
    const repo = manager ? manager.getRepository(PostImage) : this.postImageRepository;

    if (images && images.length > 0) {
      const postImages = images.map((image) =>
        this.postImageRepository.create({
          postId: postId,
          imageUrl: `${req.protocol}://${req.headers.host}/${image.path}`,
        }),
      );
      await repo.save(postImages);
    }

    if(createPostDto.tags.length > 0) {
      await this.tagsService.createTags(createPostDto.tags, manager);
    }

    return await this.postRepository.findOneBy({id: postId});
  }
}
