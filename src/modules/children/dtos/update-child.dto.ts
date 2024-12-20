import {
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsNumber,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Gender } from '../../../enums/gender.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChildDto {
  @ApiPropertyOptional({ example: 'Le Van A', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Be A', description: '' })
  @IsOptional()
  nickname: string;

  @ApiPropertyOptional({ example: '2024-10-26T07:37:05.612Z', description: '' })
  @IsOptional()
  @IsDateString()
  dateOfBirth: Date;

  @ApiPropertyOptional({ example: 'female', description: '' })
  @IsOptional()
  @IsNotEmpty()
  @IsIn([Gender.MALE, Gender.FEMALE])
  gender: Gender;

  @ApiPropertyOptional({ type: 'string', format: 'binary', name: 'avatar' })
  @IsOptional()
  avatarUrl?: string;
}
