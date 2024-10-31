import { Column } from 'typeorm';
import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChildTrackerDto {
  @ApiProperty({ example: 1, description: 'Tuần' })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  week: number;

  @ApiProperty({
    example: '<p>Content here</p>',
    description: 'Nội dung dạng HTML',
  })
  @Column('text', { nullable: true })
  content: string;
}
