import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../enums/gender.enum';
import { Language } from '../../../enums/language.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Le Van A' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'female' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: 'vi' })
  @IsEnum(Language)
  @IsOptional()
  lan?: Language;

  @ApiPropertyOptional({ type: 'string', format: 'binary', name: 'avatar' })
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  partnerId?: number;
}
