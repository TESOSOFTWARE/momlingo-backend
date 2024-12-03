import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewCategoryDto {
  @ApiProperty({ example: 'Thể thao', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Tin tức thể thao', description: '' })
  description: string;
}
