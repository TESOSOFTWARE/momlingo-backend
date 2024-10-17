import {
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsIn,
  IsNumber,
} from 'class-validator';
import { Gender } from '../../../enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChildDto {
  @ApiProperty({ example: 'Le Van A', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Be A', description: '' })
  @IsOptional()
  nickname: string;

  @ApiProperty({ example: 1718505600000, description: '' })
  @IsOptional()
  @IsNumber()
  dateOfBirth: number;

  @ApiProperty({ example: 'female', description: '' })
  @IsOptional()
  @IsNotEmpty()
  @IsIn([Gender.MALE, Gender.FEMALE])
  gender: Gender;
}
