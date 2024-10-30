// baby-info.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class BabyInfoDto {
  // @ApiPropertyOptional({ example: '1', description: 'Tuần đang tracker' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  week: number;

  @ApiPropertyOptional({ example: '3000', description: 'Đơn vị sẽ là gam' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  weight: number;

  @ApiPropertyOptional({ example: '60', description: 'Đơn vị sẽ là cm' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  high: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'thumbnail3D',
    description: 'Ảnh 3D thumbnail của bé',
  })
  @IsString()
  @IsOptional()
  thumbnail3DUrl?: string;

  @ApiPropertyOptional({
    example: 'https://xxx',
    description: 'Link dẫn đến ảnh 3D mở webview',
  })
  @IsString()
  @IsOptional()
  image3DUrl?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'symbolicImage',
    description: 'Ảnh mô tả kích thước của bé, vd ảnh quả chuối',
  })
  @IsString()
  @IsOptional()
  symbolicImageUrl?: string;

  @ApiPropertyOptional({
    example: 'E bé bằng hình quả chuối',
    description: 'Mô tả kích thước e bé',
  })
  @IsString()
  @IsOptional()
  sizeShortDescription?: string;

  @ApiPropertyOptional({
    example: 'E bé 20 tuần sẽ ...',
    description: 'Mô tả tổng quan e bé tuần đó',
  })
  @IsString()
  @IsOptional()
  babyOverallInfo?: string;

  @ApiPropertyOptional({
    example: 'E bé 20 tuần kích thước ...',
    description: 'Mô tả tổng quan kích thước e bé tuần đó',
  })
  @IsString()
  @IsOptional()
  babySizeInfo?: string;
}
