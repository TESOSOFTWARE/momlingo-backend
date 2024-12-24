// mom-info.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMusicSongDto {
  @ApiProperty({ example: 'Cơn mưa ngang qua', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Song Tung MTP', description: '' })
  @IsNotEmpty()
  artist: string;

  @ApiPropertyOptional({ example: 'Song Tung la ca si...', description: '' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: 'file',
    description: 'File nhạc',
  })
  @IsString()
  @IsOptional()
  fileUrl: string;
}
