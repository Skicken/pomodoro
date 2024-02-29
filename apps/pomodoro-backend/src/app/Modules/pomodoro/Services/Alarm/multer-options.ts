import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';
import { extname } from 'path';
import { env } from 'process';

export const maxUserAlarms = 5;
const whitelist = [
  'audio/wav',
  'audio/mpeg',
]
export const multerOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: env.ALARM_PATH,
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  },
  ),
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype)
    if (!whitelist.includes(file.mimetype)) {
      cb(new BadRequestException('File is not allowed'),false);
    }
    cb(null, true)
  }
};




