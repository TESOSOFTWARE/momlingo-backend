import { forwardRef, Module } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child } from './entities/child.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Child]),
    forwardRef(() => UsersModule),
    FileUploadModule,
  ],
  providers: [ChildrenService],
  controllers: [ChildrenController],
  exports: [ChildrenService],
})
export class ChildrenModule {
}
