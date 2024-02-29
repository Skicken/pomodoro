import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
@Controller('file')
export class FileController {
  constructor() {}

  @Get(':name')
  getFile(@Param('name') name: string, @Res() res: Response) {
    try {
      res.sendFile(name, { root: 'assets/alarms' });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
