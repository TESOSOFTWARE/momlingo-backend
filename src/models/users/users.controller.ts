import { Body, Controller, Get, Param, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserWithChildren } from './interfaces/user-with-children.interface';
import { UsersService } from './users.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dtos/update_user.dto';
import * as fs from 'fs';
import { getMulterOptions } from '../file-upload/file-upload.service';
import path from 'path';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserWithChildren> {
    return this.usersService.findUserWithPartnerAndChildrenById(id);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('user-avatars')))
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<UserWithChildren> {
    if (file) {
      updateUserDto.avatarUrl = `${req.headers.host}/${file.path}`;
    }
    await this.usersService.updateUser(id, updateUserDto);
    return this.getUser(id);
  }
}
