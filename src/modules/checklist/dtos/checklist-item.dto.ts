import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistItemStatus } from '../../../enums/checklist-item-status.enum';

export class ChecklistItemDto {
  @ApiProperty({ example: 'Item 1', description: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Note item 1', description: '' })
  description: string;

  @ApiProperty({ example: 1, description: '' })
  @IsNotEmpty()
  checklistId: number;

  @ApiProperty({
    example: 'todo',
    description: 'todo | progress | done',
  })
  @IsEnum(ChecklistItemStatus)
  @IsOptional()
  status?: ChecklistItemStatus;

  @ApiProperty({ example: '2024-10-26T07:37:05.612Z', description: '' })
  @IsDateString()
  planingDate: Date;
}
