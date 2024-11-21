// mom-info.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MusicCategoryType } from '../../../enums/music-category-type.enum';

export class MusicCategoryDto {
  @ApiProperty({ example: 'Nhạc vàng', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Là dòng nhạc...', description: '' })
  description: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'thumbnail',
    description: 'Ảnh thumbnail của category',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'normal' })
  @IsEnum(MusicCategoryType)
  type?: MusicCategoryType;
}
