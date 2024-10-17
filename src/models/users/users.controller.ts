import { Controller, Get, Param } from '@nestjs/common';
import { UserWithChildren } from './interfaces/user-with-children.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserWithChildren> {
    return this.usersService.findUserWithPartnerAndChildrenById(id);
  }
}
