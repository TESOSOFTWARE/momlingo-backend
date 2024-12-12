import { Injectable } from '@nestjs/common';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { tap } from 'rxjs/operators';

@Injectable()
export class CreatePostInterceptor implements NestInterceptor {
  constructor(private readonly postsService: PostsService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("CreatePostInterceptor intercept");
    const request = context.switchToHttp().getRequest();

    const userId = request.user?.id;
    console.log("CreatePostInterceptor userId", userId);
    if (!userId) {
      throw new Error('User not authenticated');
    }

    console.log("CreatePostInterceptor request.body", request.body);
    const createPostDtos = plainToInstance(CreatePostDto, request.body);
    const createPostDto = Array.isArray(createPostDtos) ? createPostDtos[0] : createPostDtos;

    console.log("CreatePostInterceptor createPostDto", createPostDto);
    return from(this.postsService.create(createPostDto, userId)).pipe(
      tap((post) => {
        request.body.postId = post.id;
      }),
      tap(() => next.handle()),
    );
  }
}
