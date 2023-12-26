import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import multer from "multer";
import { extname } from "path";
import { env } from "process";

export const multerOptions:MulterOptions = {
  storage: multer.diskStorage({
    destination:env.ALARM_PATH,
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
}
