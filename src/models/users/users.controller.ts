import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserWithChildren } from './interfaces/user-with-children.interface';
import { UsersService } from './users.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';

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
}
