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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MusicsService } from './musics.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MusicCategoryDto } from './dtos/music-category.dto';
import { MusicCategory } from './entities/music-category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileUploadService,
  getMulterOptions,
  getMulterOptionsForAudio,
} from '../file-upload/file-upload.service';
import { MusicSongDto } from './dtos/music-song.dto';
import { MusicSong } from './entities/music-song.entity';

@ApiTags('Music Tool')
@Controller('musics')
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
export class MusicsController {
  constructor(
    private readonly musicsService: MusicsService,
    private readonly fileUploadsService: FileUploadService,
  ) {}

  /// --- Controller for Category - START ---
  @Post('/category')
  @ApiOperation({ summary: 'Tạo mới một Category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', getMulterOptions('music-categories')),
  )
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() categoryDto: MusicCategoryDto,
    @Req() req,
  ): Promise<MusicCategory> {
    if (file) {
      categoryDto.thumbnailUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
    }
    return this.musicsService.createCategory(categoryDto);
  }

  @Get('/category')
  @ApiOperation({ summary: 'Lấy danh sách tất cả Category' })
  async findAllCategory(): Promise<MusicCategory[]> {
    return this.musicsService.findAllCategory();
  }

  @Get('/category/:id')
  @ApiOperation({ summary: 'Lấy thông tin Category theo ID' })
  async findOneCategory(@Param('id') id: number): Promise<MusicCategory> {
    console.log('Get ID');
    return this.musicsService.findOneCategory(id);
  }

  @Put('/category/:id')
  @ApiOperation({ summary: 'Cập nhật Category theo ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', getMulterOptions('music-categories')),
  )
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: MusicCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<MusicCategory> {
    const category = await this.musicsService.findOneCategory(id);

    if (file) {
      if (category.thumbnailUrl) {
        this.fileUploadsService.deleteFile(category.thumbnailUrl);
      }
      categoryDto.thumbnailUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
    }

    return this.musicsService.updateCategory(id, categoryDto);
  }

  @Delete('/category/:id')
  @ApiOperation({ summary: 'Xóa Category theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeCategory(@Param('id') id: number): Promise<void> {
    return this.musicsService.deleteCategoryAndSongs(id);
  }

  @Get('/search/category')
  @ApiOperation({
    summary: 'Tìm Category theo name',
  })
  async searchCategoryNames(
    @Query('name') name: string,
  ): Promise<MusicCategory[]> {
    return this.musicsService.findCategoryByName(name);
  }
  /// --- Controller for Category - END ---

  /// --- Controller for Song - START ---
  @Post('/song')
  @ApiOperation({ summary: 'Tạo mới một Song' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptionsForAudio('music-songs')),
  )
  async createSong(
    @UploadedFile() file: Express.Multer.File,
    @Body() songDto: MusicSongDto,
    @Req() req,
  ): Promise<MusicSong> {
    if (file) {
      songDto.fileUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
    }
    return this.musicsService.createSong(songDto);
  }

  @Get('/song')
  @ApiOperation({ summary: 'Lấy danh sách tất cả Song' })
  async findAllSong(): Promise<MusicSong[]> {
    return this.musicsService.findAllSong();
  }

  @Get('/song/popular')
  @ApiOperation({ summary: 'Lấy danh sách tất cả Song thịnh hành' })
  async findAllPopularSong(): Promise<MusicSong[]> {
    return this.musicsService.findAllPopularSong();
  }

  @Get('/song/category/:id')
  @ApiOperation({ summary: 'Lấy danh sách tất cả Song theo category' })
  async findAllSongByCategoryId(@Param('id') id: number): Promise<MusicSong[]> {
    return this.musicsService.findAllSongByCategoryId(id);
  }

  @Get('/song/:id')
  @ApiOperation({ summary: 'Lấy thông tin Song theo ID' })
  async findOneSong(@Param('id') id: number): Promise<MusicSong> {
    return this.musicsService.findOneSong(id);
  }

  @Put('/song/:id')
  @ApiOperation({ summary: 'Cập nhật Song theo ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptionsForAudio('music-songs')),
  )
  async updateSong(
    @Param('id') id: number,
    @Body() songDto: MusicSongDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<MusicSong> {
    const song = await this.musicsService.findOneSong(id);

    if (file) {
      if (song.fileUrl) {
        this.fileUploadsService.deleteFile(song.fileUrl);
      }
      songDto.fileUrl = `${req.protocol}://${req.headers.host}/${file.path}`;
    }

    return this.musicsService.updateSong(id, songDto);
  }

  @Delete('/song/:id')
  @ApiOperation({ summary: 'Xóa Song theo ID' })
  @ApiResponse({ status: 404, description: 'Tên không tìm thấy' })
  async removeSong(@Param('id') id: number): Promise<void> {
    const song = await this.musicsService.findOneSong(id);
    if (song.fileUrl) {
      this.fileUploadsService.deleteFile(song.fileUrl);
    }
    return this.musicsService.removeSong(id);
  }

  @Get('/search/song')
  @ApiOperation({
    summary: 'Tìm Song theo name',
  })
  async searchSongNames(@Query('name') name: string): Promise<MusicSong[]> {
    return this.musicsService.findSongByName(name);
  }
  /// --- Controller for Song - END ---
}
