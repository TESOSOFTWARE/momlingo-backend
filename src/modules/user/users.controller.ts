import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
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
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiBearerAuth()
@ApiResponse({
  status: 400,
  description:
    'Lỗi 400 hoặc các lỗi khác sẽ trả về dạng: {\n' +
    '    "success": false,\n' +
    '    "statusCode": 500,\n' +
    '    "message"": "Internal server error"\n' +
    '}',
})
@UseGuards(JwtGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadsService: FileUploadService,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary:
      'Lấy thông tin cơ bản của bất kì user nào theo id, không có thông tin children',
  })
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin cơ bản của của chính mình, có thông tin children',
  })
  async getProfile(@Req() req): Promise<UserWithChildren> {
    const userId = req.user.id;
    return this.usersService.findUserWithPartnerAndChildrenById(userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả danh sách user, không có children, dành cho Admin',
  })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('user-avatars')))
  @ApiResponse({
    status: 200,
    description:
      'Trả về mình thông tin user chứ không có children, vì cái này giảm request cho BE và MB tự xử lý được. Thành công xong update thông tin user thôi và copy children từ trước đó!',
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<UserWithChildren> {
    const currentUser = await this.usersService.findOneById(id);

    if (
      currentUser.avatarUrl &&
      currentUser.avatarUrl.includes(req.headers.host)
    ) {
      this.fileUploadsService.deleteFile(currentUser.avatarUrl);
    }

    if (file) {
      updateUserDto.avatarUrl = `${req.headers.host}/${file.path}`;
    }

    // Chỉ cập nhật những trường có giá trị trong updateUserDto
    const updatedUser = { ...currentUser, ...updateUserDto };

    await this.usersService.updateUser(id, updatedUser);
    return this.getProfile(req);
  }
}
