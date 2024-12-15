import { IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCommentDto {
  @ApiProperty({ example: 'Content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  postId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
