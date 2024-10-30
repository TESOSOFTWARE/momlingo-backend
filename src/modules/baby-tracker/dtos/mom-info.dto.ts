// mom-info.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class MomInfoDto {
  // @ApiPropertyOptional({ example: '1', description: 'Tuần đang tracker' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  week: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    name: 'thumbnail3D',
    description: 'Ảnh 3D thumbnail của mẹ',
  })
  @IsString()
  @IsOptional()
  thumbnail3DUrl?: string;

  @ApiPropertyOptional({
    example:
      'https://human.biodigital.com/widget/?m=client/the_bump_web/baby_week_20.json',
    description: 'Link dẫn đến ảnh 3D mở webview',
  })
  @IsString()
  @IsOptional()
  image3DUrl?: string;

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
}
