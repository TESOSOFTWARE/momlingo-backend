import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class CreatePostInterceptor implements NestInterceptor {
  constructor(private readonly postsService: PostsService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const createPostDtos = plainToInstance(CreatePostDto, request.body);
    const createPostDto = Array.isArray(createPostDtos) ? createPostDtos[0] : createPostDtos;
    return this.postsService.create(createPostDto).then((post) => {
      request.body.postId = post.id;
      return next.handle();
    });
  }
}
