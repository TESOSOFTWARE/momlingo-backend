import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../../enums/gender.enum';
import { Language } from '../../../enums/language.enum';

export class NameDto {
  @ApiProperty({ example: 'Le Van A', description: 'Họ tên đầy đủ' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Lê là ...', description: 'Ý nghĩa họ tên đó' })
  @IsOptional()
  meaning: string;

  @ApiPropertyOptional({ example: 'female' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: 'vi' })
  @IsEnum(Language)
  @IsOptional()
  lan?: Language;
}
