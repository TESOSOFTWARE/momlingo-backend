import { Injectable, NotFoundException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  deleteFile(fullPath: string): void {
    try {
      const uploadsIndex = fullPath.indexOf('uploads');
      if (uploadsIndex !== -1) {
        unlinkSync(fullPath.slice(uploadsIndex));
      }
    } catch (error) {
      throw new NotFoundException(`File at ${fullPath} not found`);
    }
  }

  async moveFile(tempFilePath: string, destFolderPath: string): Promise<void> {
    // Ex: tempFilePath = '/uploads/temp/avatar-1732985081878-521758090.jpg';
    // Ex: destFolderPath = '/uploads/child-avatars/';

    if (typeof tempFilePath !== 'string' || !tempFilePath) {
      console.error('Đường dẫn tệp tạm không hợp lệ:', tempFilePath);
      return;
    }

    console.log('path', path);
    // Lấy tên tệp từ đường dẫn gốc (giữ nguyên tên)
    const fileName = path.basename(tempFilePath);  // Lấy tên tệp từ đường dẫn tạm (ví dụ: 'avatar-1732985081878-521758090.jpg')

    // Tạo đường dẫn đích mới (thư mục đích + tên tệp giữ nguyên)
    const destFilePath = path.join(destFolderPath, fileName);

    try {
      // Kiểm tra và tạo thư mục đích nếu chưa tồn tại
      await fs.mkdir(destFolderPath, { recursive: true });

      // Di chuyển tệp từ tempFilePath đến destFilePath
      await fs.rename(tempFilePath, destFilePath);

      console.log(`Tệp đã được di chuyển từ ${tempFilePath} đến ${destFilePath}`);
    } catch (error) {
      console.error('Lỗi khi di chuyển tệp:', error);
    }
  }
}

export function getMulterOptions(folderName: string): MulterOptions {
  return {
    storage: diskStorage({
      destination: `./uploads/${folderName}`,
      filename: (req, file, cb) => {
        const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      // Due mobile is logging file.mimetype application/octet-stream
      /*if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new Error('Only jpg|jpeg|png image files are allowed!'), false);
      }*/
      cb(null, true);
    },
  };
}

export function getMulterOptionsForAudio(folderName: string): MulterOptions {
  return {
    storage: diskStorage({
      destination: `./uploads/${folderName}`,
      filename: (req, file, cb) => {
        const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
    limits: {
      fileSize: 15 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      // Due mobile is logging file.mimetype application/octet-stream
      /*if (!file.mimetype.match(/\/(mp3|mpeg|wav|ogg)$/)) {
        return cb(new Error('Only mp3|mpeg|wav|ogg files are allowed!'), false);
      }*/
      cb(null, true);
    },
  };
}
