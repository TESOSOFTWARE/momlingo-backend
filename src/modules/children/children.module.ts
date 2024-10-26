import { Module } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from './entities/child.entity';
import { User } from '../user/entities/user.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Child, User]),
    UsersModule,
    FileUploadModule,
  ],
  providers: [ChildrenService],
  controllers: [ChildrenController],
  exports: [TypeOrmModule, ChildrenService],
})
export class ChildrenModule {}
