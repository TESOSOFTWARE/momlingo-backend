import { Injectable, NotFoundException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

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
