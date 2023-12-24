import { FileInterceptor } from '@nestjs/platform-express';
import { AlarmService } from '../Services/Alarm/alarm.service';
import { Body, Controller, HttpException, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AddAlarmDto } from '../Dto/add-alarm-dto';
import { Validate } from 'class-validator';
import { multerOptions } from '../Services/Alarm/multer-options';

@Controller('alarm')
export class AlarmController {

  constructor(private alarmService: AlarmService) {
  }
  @Post()
  @UseInterceptors(FileInterceptor('alarm',multerOptions))

  uploadFile(
    @UploadedFile(new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'wav',
      })
      .addMaxSizeValidator({
        maxSize: 1048576, // just to you know it's possible.
      })
      .build({
        exceptionFactory(error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        },
      })) alarmFile: Express.Multer.File, @Body() alarmDTO:AddAlarmDto  ) {
        console.log(alarmDTO)
        return this.alarmService.addAlarm(alarmFile,alarmDTO);
  }


}
