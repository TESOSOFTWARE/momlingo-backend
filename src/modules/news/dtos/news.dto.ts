import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NewsDto {
  @ApiProperty({ example: 'Bình dương chia tay đồng đội cũ Neymar', description: '' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: 'Id người tạo bài viết' })
  @IsNotEmpty()
  authorId: number;

  @ApiPropertyOptional({
    example: 'Đội chủ sân Gò Đậu kết thúc hợp đồng với tiền đạo Weillington Nem chỉ sau ba tháng, do yếu kiếm chuyên môn.',
    description: '',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: 'thumbnail',
    description: 'File ảnh',
  })
  @IsOptional()
  thumbnailUrl: string;

  @ApiProperty({ example: 1, description: '' })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ example: 1, description: '' })
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: true, description: '' })
  @IsOptional()
  isPublished: boolean;
}
