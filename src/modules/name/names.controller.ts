import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NamesService } from './names.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NameDto } from './dtos/name.dto';
import { Name } from './entities/name.entity';
import { Gender } from '../../enums/gender.enum';
import { Language } from '../../enums/language.enum';

@ApiTags('Names')
@Controller('names')
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
export class NamesController {
  constructor(private readonly namesService: NamesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới một tên' })
  async create(@Body() nameDto: NameDto): Promise<Name> {
    return this.namesService.create(nameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả tên' })
  @ApiQuery({
    name: 'currentPage',
    required: false,
    description: 'Trang hiện tại (mặc định là 1)',
    type: Number,
    example: 1,
  })
  async findAllName(
    @Query('currentPage') currentPage = 1,
  ) {
    const pageNumber = Number(currentPage);
    return this.namesService.getAllName(pageNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin tên theo ID' })
  async findOne(@Param('id') id: number): Promise<Name> {
    console.log('Get ID');
    return this.namesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật tên theo ID' })
  async update(
    @Param('id') id: number,
    @Body() nameDto: NameDto,
  ): Promise<Name> {
    return this.namesService.update(id, nameDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tên theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.namesService.remove(id);
  }

  @Get('search/name')
  @ApiOperation({
    summary:
      'Tìm tên chứa các chữ cái từ họ tên, có thể lọc theo giới tính và ngôn ngữ',
  })
  async searchNames(
    @Query('fullName') fullName: string,
    @Query('gender') gender?: Gender,
    @Query('lan') lan?: Language,
  ): Promise<Name[]> {
    return this.namesService.findByName(fullName, gender, lan);
  }
}
