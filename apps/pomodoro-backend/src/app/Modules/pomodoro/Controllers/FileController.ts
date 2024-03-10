import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { env } from 'process';
@Controller('file')
export class FileController {
  constructor() {}

  @Get(':name')
  GetFile(@Param('name') name: string, @Res() res: Response) {
    try {
      res.sendFile(name, { root: env.ALARM_PATH });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
