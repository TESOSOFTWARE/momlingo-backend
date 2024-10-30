import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BabyTrackersService } from './baby-trackers.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  FileUploadService,
  getMulterOptions,
} from '../file-upload/file-upload.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BabyTracker } from './entities/baby-tracker.entity';
import { CreateBabyTrackerDto } from './dtos/baby-tracker.dto';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import * as fs from 'fs-extra';
import { WeekGuard } from './guards/week.guard';

const babyTrackerMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const week = req.body.week;
      console.log('week diskStorage', week);
      const uploadPath = `./uploads/baby-trackers/week-${week}`;
      try {
        await fs.ensureDir(uploadPath);
        console.log('Thư mục đã được tạo:', uploadPath);
        cb(null, uploadPath);
      } catch (error) {
        console.error('Không thể tạo thư mục:', error);
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
};

@Controller('baby-trackers')
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
export class BabyTrackersController {
  constructor(
    private readonly babyTrackersService: BabyTrackersService,
    private readonly fileUploadsService: FileUploadService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả danh sách baby-tracker',
  })
  async getAllBabyTrackersWithRelations(): Promise<BabyTracker[]> {
    return this.babyTrackersService.findAllWithRelations();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy baby tracker theo record id',
  })
  async getBabyTrackerByIdWithRelations(
    @Param('id') id: number,
  ): Promise<BabyTracker> {
    return await this.babyTrackersService.findOneByIdWithRelations(id);
  }

  @Get(':week')
  @ApiOperation({
    summary: 'Lấy baby tracker theo week',
  })
  async getBabyTrackerByWeekWithRelations(
    @Param('week') week: number,
  ): Promise<BabyTracker> {
    return await this.babyTrackersService.findOneByWeekWithRelations(week);
  }

  @Post('/create')
  @ApiBody({ type: CreateBabyTrackerDto })
  @ApiOperation({
    summary: 'Tạo thông tin 1 tracker cho bầu tuần thứ X',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description:
      'Trả về đầy đủ thông tin baby-tracker. Ảnh <= 5Mb và chỉ hỗ hỗ trợ png, jpg, jpeg',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail3DMom', maxCount: 1 },
        { name: 'thumbnail3DBaby', maxCount: 1 },
        { name: 'symbolicImageBaby', maxCount: 1 },
      ],
      babyTrackerMulterOptions,
    ),
  )
  async create(
    @Body() createBabyTrackerDto: CreateBabyTrackerDto,
    @UploadedFiles()
    files: {
      thumbnail3DMom?: Express.Multer.File[];
      thumbnail3DBaby?: Express.Multer.File[];
      symbolicImageBaby?: Express.Multer.File[];
    },
    @Req() req,
  ) {
    if (files.thumbnail3DMom[0]) {
      createBabyTrackerDto.thumbnail3DUrlMom = `${req.headers.host}/${files.thumbnail3DMom[0].path}`;
    }
    if (files.thumbnail3DBaby[0]) {
      createBabyTrackerDto.thumbnail3DUrlBaby = `${req.headers.host}/${files.thumbnail3DBaby[0].path}`;
    }
    if (files.symbolicImageBaby[0]) {
      createBabyTrackerDto.symbolicImageUrl = `${req.headers.host}/${files.symbolicImageBaby[0].path}`;
    }
    // TODO, change to WeekGuard later
    const existingTracker = await this.babyTrackersService.findOneByWeek(
      createBabyTrackerDto.week,
    );
    if (existingTracker) {
      this.fileUploadsService.deleteFile(
        createBabyTrackerDto.thumbnail3DUrlMom,
      );
      this.fileUploadsService.deleteFile(
        createBabyTrackerDto.thumbnail3DUrlBaby,
      );
      this.fileUploadsService.deleteFile(createBabyTrackerDto.symbolicImageUrl);
      throw new BadRequestException(
        `Week ${createBabyTrackerDto.week} already exists.`,
      );
    }
    return this.babyTrackersService.create(createBabyTrackerDto);
  }

  /*@Put(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin child. Chỉ truyền avatar khi file != null',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar', getMulterOptions('child-avatars')))
  @ApiResponse({
    status: 200,
    description:
      'Trả về mình thông tin child chứ không có thông tin mother, father. Ảnh <= 5Mb và chỉ hỗ hỗ trợ png, jpg, jpeg',
  })
  async updateChild(
    @Param('id') id: number,
    @Body() updateChildDto: UpdateChildDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Child> {
    const currentChild = await this.babyTrackersService.findOneById(id);

    if (file) {
      if (currentChild.avatarUrl) {
        this.fileUploadsService.deleteFile(currentChild.avatarUrl);
      }
      updateChildDto.avatarUrl = `${req.headers.host}/${file.path}`;
    }

    // Chỉ cập nhật những trường có giá trị trong updateChildDto
    const updatedChild = { ...currentChild, ...updateChildDto };

    const userId = req.user.id;
    return this.babyTrackersService.updateChild(id, updatedChild, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá con',
  })
  @ApiResponse({
    status: 200,
    description: 'Không trả về response, cứ success là thành công',
  })
  async deleteChild(@Param('id') id: number, @Req() req): Promise<void> {
    const userId = req.user.id;
    const currentChild = await this.babyTrackersService.findOneById(id);
    if (currentChild.avatarUrl) {
      this.fileUploadsService.deleteFile(currentChild.avatarUrl);
    }
    return this.babyTrackersService.deleteChild(id, userId);
  }*/
}
