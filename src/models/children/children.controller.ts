import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { Child } from './entities/child.entity';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { CreateChildDto } from './dtos/create-child.dto';
import { ApiBody } from '@nestjs/swagger';
import { UpdateChildDto } from './dtos/update-child.dto';

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

  @ApiBody({ type: CreateChildDto })
  @Post()
  async createChild(
    @Body() createChildDto: CreateChildDto,
    @Req() req,
  ): Promise<Child> {
    const userId = req.user.id;
    const dateOfBirth = new Date(createChildDto.dateOfBirth);
    return this.childrenService.createChild(
      { ...createChildDto, dateOfBirth } as CreateChildDto & {
        dateOfBirth: Date;
      },
      userId,
    );
  }

  @ApiBody({ type: UpdateChildDto })
  @Patch(':id')
  async updateChild(
    @Param('id') id: number,
    @Body() updateChildDto: UpdateChildDto,
    @Req() req,
  ): Promise<Child> {
    const userId = req.user.id;
    return this.childrenService.updateChild(id, updateChildDto, userId);
  }

  @Delete(':id')
  async deleteChild(@Param('id') id: number, @Req() req): Promise<void> {
    const userId = req.user.id;
    return this.childrenService.deleteChild(id, userId);
  }
}
