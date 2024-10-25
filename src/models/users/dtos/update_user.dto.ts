import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../enums/gender.enum';
import { Language } from '../../../enums/language.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'Le Van A'})
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123456789'})
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'female'})
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ example: 'vi'})
  @IsEnum(Language)
  @IsOptional()
  lan?: Language;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  deviceToken?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: 1})
  @IsInt()
  @IsOptional()
  partnerId?: number;

}
