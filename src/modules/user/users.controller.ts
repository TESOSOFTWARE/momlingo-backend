import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put, Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserWithChildren } from './interfaces/user-with-children.interface';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dtos/update_user.dto';
import {
  FileUploadService,
  getMulterOptions,
} from '../file-upload/file-upload.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
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
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadsService: FileUploadService,
  ) {
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Lấy thông tin cơ bản của bất kì user nào theo id, không có thông tin children',
  })
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Get(':id/profile')
  @ApiOperation({
    summary: 'Lấy thông full thông tin user và children dựa vào user id',
  })
  async getProfile(@Param('id') id: number): Promise<UserWithChildren> {
    return this.usersService.findUserWithPartnerAndChildrenById(id);
  }

  @Get('/profile/me')
  @ApiOperation({
    summary: 'Lấy thông full thông tin user và children dựa vào access token',
  })
  async getMyProfile(@Req() req): Promise<UserWithChildren> {
    return this.usersService.findUserWithPartnerAndChildrenById(req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả danh sách user, không có children, dành cho Admin',
  })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async getAllUsers(@Query('currentPage') currentPage = 1) {
    const pageNumber = Number(currentPage);
    return this.usersService.getUsers(pageNumber);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin user. Chỉ truyền avatar khi file != null',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('user-avatars')))
  @ApiResponse({
    status: 200,
    description:
      'Trả về mình thông tin user chứ không có children, vì cái này giảm query cho BE và MB tự xử lý được. ' +
      'Thành công xong update thông tin user thôi và copy children từ trước đó!. Ảnh <= 5Mb và chỉ hỗ hỗ trợ png, jpg, jpeg',
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, file, req);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá user',
  })
  @ApiResponse({
    status: 200,
    description: 'Không trả về response, cứ success là thành công',
  })
  async deleteUser(@Param('id') id: number, @Req() req: any): Promise<void> {
    return this.usersService.deleteUser(id, req);
  }
}
