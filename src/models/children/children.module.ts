import { Module } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from './entities/child.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Child, User])],
  providers: [ChildrenService],
  controllers: [ChildrenController],
  exports: [TypeOrmModule, ChildrenService],
})
export class ChildrenModule {}
