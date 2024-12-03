import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskGroupType } from '../../../enums/task-group-type.enum';

export class ChecklistDto {
  @ApiProperty({ example: 'Khám sức khoẻ', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sức khoẻ bầu tháng 1', description: '' })
  description: string;

  @ApiProperty({
    example: 0,
    description: '0: Khám thai, 1: Sức Khoẻ, 2: Chuẩn bị đồ sinh, 3: Mua đồ cho bé, 4. Học chăm sóc trẻ. 5 Khác',
  })
  @IsEnum(TaskGroupType)
  @IsOptional()
  taskGroupType?: TaskGroupType;

  @ApiProperty({ example: '2024-10-26T07:37:05.612Z', description: '' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2024-10-26T07:37:05.612Z', description: '' })
  @IsDateString()
  endDate: Date;
}
