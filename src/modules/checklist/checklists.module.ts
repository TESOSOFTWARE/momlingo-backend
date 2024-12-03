import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistsService } from './checklists.service';
import { ChecklistsController } from './checklists.controller';
import { ChecklistItem } from './entities/checklist-item.entity';
import { Checklist } from './entities/checklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checklist, ChecklistItem]),
  ],
  providers: [ChecklistsService],
  controllers: [ChecklistsController],
  exports: [ChecklistsService],
})
export class ChecklistsModule {
}
