import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put, Query,
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
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateChildDto } from './dtos/update-child.dto';
import {
  FileUploadService,
  getMulterOptions,
} from '../file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../user/users.service';

@ApiTags('Children')
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
  ) {
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
    return this.childrenService.createChild(createChildDto, userId, file, req);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin cơ bản của 1 children qua id',
  })
  async getChild(@Param('id') id: number): Promise<Child | null> {
    return this.childrenService.findOneById(id);
  }

  @Get('/parents/:userId')
  @ApiOperation({
    summary: 'Lấy danh sách tất cả children theo user id',
  })
  async getAllChildrenByUserId(@Param('userId') userId: number) {
    return this.childrenService.findAllByUserId(userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả children trong database',
  })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async getAllChildren(
    @Query('currentPage') currentPage = 1,
  ) {
    const pageNumber = Number(currentPage);
    return this.childrenService.getAllChildren(pageNumber);
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
    const userId = req.user.id;
    return this.childrenService.updateChild(id, updateChildDto, userId, file, req);
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
    return this.childrenService.deleteChild(id, req.user.id, null);
  }
}
