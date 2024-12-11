import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { PostStatus } from '../../../enums/post-status.enum';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @IsBoolean()
  @IsOptional()
  enableComment?: boolean = true;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @Max(5)
  @Min(0)
  @IsArray()
  @IsOptional()
  images?: string[];
}
