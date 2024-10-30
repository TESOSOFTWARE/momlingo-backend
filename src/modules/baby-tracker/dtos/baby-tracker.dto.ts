// baby-tracker.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';
import { MomInfoDto } from './mom-info.dto';
import { BabyInfoDto } from './baby-info.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBabyTrackerDto {
  @ApiPropertyOptional({ example: '1', description: 'Tuần đang tracker' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  week: number;

  @ApiPropertyOptional({
    example: '',
    description: 'Nội dung trọng tâm của tuần đó',
  })
  @IsString()
  @IsOptional()
  keyTakeaways?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'thumbnail3DMom',
    description: 'Ảnh 3D thumbnail của mẹ',
  })
  @IsString()
  @IsOptional()
  thumbnail3DUrlMom?: string;

  @ApiPropertyOptional({
    example:
      'https://human.biodigital.com/widget/?m=client/the_bump_web/mom_week_20.json',
    description: 'Link dẫn đến ảnh 3D mở webview',
  })
  @IsString()
  @IsOptional()
  image3DUrlMom?: string;

  @ApiPropertyOptional({
    example: 'Mẹ thường có biểu hiện...',
    description: 'Mô tả triệu trứng của mẹ',
  })
  @IsString()
  @IsOptional()
  symptoms?: string;

  @ApiPropertyOptional({
    example: 'Mẹ nên làm ...',
    description: 'Mô tả việc mẹ nên làm',
  })
  @IsString()
  @IsOptional()
  thingsTodo?: string;

  @ApiPropertyOptional({
    example: 'Mẹ nên tránh ...',
    description: 'Mô tả việc mẹ nên tránh',
  })
  @IsString()
  @IsOptional()
  thingsToAvoid?: string;

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
    name: 'thumbnail3DBaby',
    description: 'Ảnh 3D thumbnail của bé',
  })
  @IsString()
  @IsOptional()
  thumbnail3DUrlBaby?: string;

  @ApiPropertyOptional({
    example: 'https://xxx',
    description: 'Link dẫn đến ảnh 3D mở webview',
  })
  @IsString()
  @IsOptional()
  image3DUrlBaby?: string;

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

export class UpdateBabyTrackerDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Nội dung trọng tâm của tuần đó',
  })
  @IsString()
  @IsOptional()
  keyTakeaways?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'thumbnail3D',
    description: 'Ảnh 3D thumbnail của mẹ',
  })
  @IsString()
  @IsOptional()
  thumbnail3DUrlMom?: string;

  @ApiPropertyOptional({
    example:
      'https://human.biodigital.com/widget/?m=client/the_bump_web/baby_week_20.json',
    description: 'Link dẫn đến ảnh 3D mở webview',
  })
  @IsString()
  @IsOptional()
  image3DUrlMom?: string;

  @ApiPropertyOptional({
    example: 'Mẹ thường có biểu hiện...',
    description: 'Mô tả triệu trứng của mẹ',
  })
  @IsString()
  @IsOptional()
  symptoms?: string;

  @ApiPropertyOptional({
    example: 'Mẹ nên làm ...',
    description: 'Mô tả việc mẹ nên làm',
  })
  @IsString()
  @IsOptional()
  thingsTodo?: string;

  @ApiPropertyOptional({
    example: 'Mẹ nên tránh ...',
    description: 'Mô tả việc mẹ nên tránh',
  })
  @IsString()
  @IsOptional()
  thingsToAvoid?: string;

  @ApiPropertyOptional({ example: '3000', description: 'Đơn vị sẽ là gam' })
  @IsInt()
  weight: number;

  @ApiPropertyOptional({ example: '60', description: 'Đơn vị sẽ là cm' })
  @IsInt()
  height: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'thumbnail3D',
    description: 'Ảnh 3D thumbnail của bé',
  })
  @IsString()
  @IsOptional()
  thumbnail3DUrlBaby?: string;

  @ApiPropertyOptional({
    example: 'https://xxx',
    description: 'Link dẫn đến ảnh 3D mở webview',
  })
  @IsString()
  @IsOptional()
  image3DUrlBaby?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'symbolicImageBaby',
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
