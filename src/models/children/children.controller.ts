import { Controller, Get, Param, UseGuards} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { Child } from './entities/child.entity';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('children')
@UseGuards(JwtGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<Child> {
    return this.childrenService.findOneById(id);
  }

  @Get()
  async getAllUsers() {
    return this.childrenService.findAll();
  }
}
