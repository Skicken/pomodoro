import { FileInterceptor } from '@nestjs/platform-express';
import { AlarmService } from '../Services/Alarm/alarm.service';
import { Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseFilePipeBuilder, ParseIntPipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import {  multerOptions } from '../Services/Alarm/multer-options';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { TokenPayload } from '../../auth/Services/authenticate.service';
import { FilterByUserID } from '../Filters/FilterByUserID';
import { ExtractPayload, checkOwnerThrow } from '../../auth/Guards/extract-payload.decorator';
import { Role, RoleGuard } from '../../auth/Guards/role.guard';
import { UserType } from '@prisma/client';
import fs from 'fs';
import { env } from 'process';
import path from 'path';
import { SettingValueService } from '../Services/SettingValue/settingvalue.service';
@Controller('alarm')
@UseGuards(JwtAuthGuard)
export class AlarmController {

  constructor(private alarmService: AlarmService,
    private settingValueService:SettingValueService
    ) {
  }
  @Post()
  @UseInterceptors(FileInterceptor('alarm',multerOptions))
  UploadAlarm(
    @UploadedFile(new ParseFilePipeBuilder()
      .addMaxSizeValidator({
        maxSize: 5*1024*1024,
      })
      .build()) alarmFile: Express.Multer.File, @ExtractPayload() payload:TokenPayload  ) {
        return this.alarmService.AddAlarm(alarmFile,payload);
  }


  @Get(":id")
  async GetAlarm(@Param("id",ParseIntPipe) id:number, @ExtractPayload() payload:TokenPayload)
  {
    const alarm = await this.alarmService.GetAlarm(id);
    checkOwnerThrow(alarm.ownerID,payload);
    return alarm;
  }


  @Get()
  GetAlarmFilter( @Query() query:FilterByUserID,@ExtractPayload() payload:TokenPayload )
  {
    checkOwnerThrow(query.userID,payload);
    return this.alarmService.GetAlarmFilter(query);
  }


  @Get()
  @Role(UserType.ADMIN)
  @UseGuards(RoleGuard)
  async GetAlarms()
  {
    return this.alarmService.getAlarms();
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteAlarm(@Param("id",ParseIntPipe) id:number, @ExtractPayload() payload:TokenPayload)
  {
    const alarm = await this.alarmService.GetAlarm(id);
    checkOwnerThrow(alarm.ownerID,payload);
    const deleteAlarmPath = path.join(env.ALARM_PATH,alarm.urlPath);
    if(fs.existsSync(deleteAlarmPath))
    {
      Logger.log("Successfully deleted alarm")
      fs.unlinkSync(deleteAlarmPath);
    }
    this.settingValueService.ResetSettingToDefault("pomodoroAlert",alarm.id.toString())
    this.settingValueService.ResetSettingToDefault("breakAlert",alarm.id.toString())


    return this.alarmService.DeleteAlarm(id);
  }

}
