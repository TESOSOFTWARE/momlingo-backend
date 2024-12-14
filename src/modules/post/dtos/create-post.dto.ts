import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, Max, Min } from 'class-validator';
import { PostStatus } from '../../../enums/post-status.enum';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'public', description: 'public(tất cả mọi người) | private(chỉ mình tôi)' })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus = PostStatus.PUBLIC;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  enableComment?: boolean = true;

  @ApiPropertyOptional({
    example: ['tag1', 'tag2'],
    description: 'Trong postman truyền sẽ là: tags[0]: tag1; tags[1]: tag2 vì không truyển list string được',
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    type: [String],
    format: 'binary',
    name: 'images',
    description: 'Trong postman upload nhiều file cùng 1 trường images được',
  })
  @Max(5)
  @Min(0)
  @IsArray()
  @IsOptional()
  images?: string[];
}
