import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { Child } from './entities/child.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateChildDto } from './dtos/create-child.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateChildDto } from './dtos/update-child.dto';
import {
  FileUploadService,
  getMulterOptions,
} from '../file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../user/users.service';

@Controller('children')
@ApiBearerAuth()
@ApiResponse({
  status: 400,
  description:
    'Lỗi 400 hoặc các lỗi khác sẽ trả về dạng: {\n' +
    '    "message": "User not found",\n' +
    '    "statusCode": 500,\n' +
    '    "error"": "Internal server error"\n' +
    '}',
})
@UseGuards(JwtGuard)
export class ChildrenController {
  constructor(
    private readonly childrenService: ChildrenService,
    private readonly usersService: UsersService,
    private readonly fileUploadsService: FileUploadService,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin cơ bản của 1 children qua id',
  })
  async getChild(@Param('id') id: number): Promise<Child> {
    return this.childrenService.findOneById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả children trong database',
  })
  async getAllChildren() {
    return this.childrenService.findAll();
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Lấy danh sách tất cả children theo user id',
  })
  async getAllChildrenByUserId(@Param('userId') userId: number) {
    return this.childrenService.findAllByUserId(userId);
  }

  @Post()
  @ApiBody({ type: CreateChildDto })
  @ApiOperation({
    summary: 'Tạo con. Chỉ truyền avatar khi file != null',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('child-avatars')))
  @ApiResponse({
    status: 200,
    description:
      'Trả về mình thông tin của con và ba mẹ. Ảnh <= 5Mb và chỉ hỗ hỗ trợ png, jpg, jpeg',
  })
  async createChild(
    @UploadedFile() file: Express.Multer.File,
    @Body() createChildDto: CreateChildDto,
    @Req() req,
  ): Promise<Child> {
    const userId = req.user.id;
    if (file) {
      createChildDto.avatarUrl = `${req.headers.host}/${file.path}`;
    }
    return this.childrenService.createChild(createChildDto, userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin child. Chỉ truyền avatar khi file != null',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('child-avatars')))
  @ApiResponse({
    status: 200,
    description:
      'Trả về mình thông tin child chứ không có thông tin mother, father. Ảnh <= 5Mb và chỉ hỗ hỗ trợ png, jpg, jpeg',
  })
  async updateChild(
    @Param('id') id: number,
    @Body() updateChildDto: UpdateChildDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Child> {
    const currentChild = await this.childrenService.findOneById(id);

    if (file) {
      if (currentChild.avatarUrl) {
        this.fileUploadsService.deleteFile(currentChild.avatarUrl);
      }
      updateChildDto.avatarUrl = `${req.headers.host}/${file.path}`;
    }

    // Chỉ cập nhật những trường có giá trị trong updateChildDto
    const updatedChild = { ...currentChild, ...updateChildDto };

    const userId = req.user.id;
    return this.childrenService.updateChild(id, updatedChild, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá con',
  })
  @ApiResponse({
    status: 200,
    description: 'Không trả về response, cứ success là thành công',
  })
  async deleteChild(@Param('id') id: number, @Req() req): Promise<void> {
    const userId = req.user.id;
    const currentChild = await this.childrenService.findOneById(id);
    if (currentChild.avatarUrl) {
      this.fileUploadsService.deleteFile(currentChild.avatarUrl);
    }
    return this.childrenService.deleteChild(id, userId);
  }
}
