import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChecklistsService } from './checklists.service';
import { ChecklistDto } from './dtos/checklist.dto';
import { Checklist } from './entities/checklist.entity';
import { ChecklistItemDto } from './dtos/checklist-item.dto';
import { ChecklistItem } from './entities/checklist-item.entity';

@ApiTags('Checklists')
@Controller('checklists')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  /// --- Controller for Checklist - START ---
  @Post('/checklist')
  @ApiOperation({ summary: 'Tạo mới một Checklist' })
  async createChecklist(
    @Body() checklistDto: ChecklistDto,
    @Req() req,
  ): Promise<Checklist> {
    return this.checklistsService.createChecklist(checklistDto);
  }

  @Get('/checklist/userId/:userId')
  @ApiOperation({
    summary:
      'Lấy danh sách tất cả Checklist theo user id sắp xếp theo start date tăng dần',
  })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'currentTime',
    required: false,
    description:
      'currentTime: true(mặc định) => Chỉ lấy Checklist chưa kết thúc, currentTime: false => Lấy tất cả',
    type: Boolean,
    example: true,
  })
  async findAllChecklistByUserId(
    @Param('userId') userId: number,
    @Query('currentPage') currentPage = 1,
    @Query('currentTime') currentTime = 'true',
  ) {
    const pageNumber = Number(currentPage);
    return this.checklistsService.findAllChecklistByUserId(
      userId,
      pageNumber,
      currentTime,
    );
  }

  @Get('/checklist/:id')
  @ApiOperation({ summary: 'Lấy thông tin Checklist theo ID' })
  async findOneChecklist(@Param('id') id: number): Promise<Checklist> {
    return this.checklistsService.findOneChecklist(id);
  }

  @Put('/checklist/:id')
  @ApiOperation({ summary: 'Cập nhật Checklist theo ID' })
  async updateChecklist(
    @Param('id') id: number,
    @Body() checklistDto: ChecklistDto,
    @Req() req: any,
  ): Promise<Checklist> {
    await this.checklistsService.findOneChecklist(id);
    return await this.checklistsService.updateChecklist(id, checklistDto);
  }

  @Delete('/checklist/:id')
  @ApiOperation({ summary: 'Xóa Checklist theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeChecklist(@Param('id') id: number): Promise<void> {
    return this.checklistsService.deleteChecklistAndChecklistItem(id);
  }

  @Get('/search/checklist')
  @ApiOperation({
    summary: 'Tìm Checklist theo name',
  })
  async searchChecklistNames(
    @Query('name') name: string,
  ): Promise<Checklist[]> {
    return this.checklistsService.findChecklistByName(name);
  }

  /// --- Controller for Checklist - END ---

  /// --- Controller for ChecklistItem - START ---
  @Post('/checklistItem')
  @ApiOperation({ summary: 'Tạo mới một ChecklistItem' })
  async createChecklistItem(
    @Body() checklistItemDto: ChecklistItemDto,
    @Req() req,
  ): Promise<ChecklistItem> {
    return this.checklistsService.createChecklistItem(checklistItemDto);
  }

  @Get('/checklistItem')
  @ApiOperation({ summary: 'Lấy danh sách tất cả ChecklistItem' })
  async findAllChecklistItem(): Promise<ChecklistItem[]> {
    return this.checklistsService.findAllChecklistItem();
  }

  @Get('/checklistItem/checklist/:id')
  @ApiOperation({
    summary: 'Lấy danh sách tất cả ChecklistItem theo Checklist',
  })
  async findAllChecklistItemByChecklistId(
    @Param('id') id: number,
  ): Promise<ChecklistItem[]> {
    return this.checklistsService.findAllChecklistItemByChecklistId(id);
  }

  @Get('/checklistItem/:id')
  @ApiOperation({ summary: 'Lấy thông tin ChecklistItem theo ID' })
  async findOneChecklistItem(@Param('id') id: number): Promise<ChecklistItem> {
    return this.checklistsService.findOneChecklistItem(id);
  }

  @Put('/checklistItem/:id')
  @ApiOperation({ summary: 'Cập nhật ChecklistItem theo ID' })
  async updateChecklistItem(
    @Param('id') id: number,
    @Body() checklistItemDto: ChecklistItemDto,
    @Req() req: any,
  ): Promise<ChecklistItem> {
    await this.checklistsService.findOneChecklistItem(id);
    return this.checklistsService.updateChecklistItem(id, checklistItemDto);
  }

  @Delete('/checklistItem/:id')
  @ApiOperation({ summary: 'Xóa ChecklistItem theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeChecklistItem(@Param('id') id: number): Promise<void> {
    await this.checklistsService.findOneChecklistItem(id);
    await this.checklistsService.removeChecklistItem(id);
  }

  /// --- Controller for ChecklistItem - END ---
}
