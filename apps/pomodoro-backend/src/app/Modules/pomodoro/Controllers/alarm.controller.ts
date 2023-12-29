import { FileInterceptor } from '@nestjs/platform-express';
import { AlarmService } from '../Services/Alarm/alarm.service';
import { Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Logger, Param, ParseFilePipeBuilder, ParseIntPipe, Post, Query, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { multerOptions } from '../Services/Alarm/multer-options';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { Request } from 'express';
import { TokenPayload } from '../../auth/Services/authenticate.service';
import { FilterByUserID } from '../Filters/FilterByUserID';
import { IsOwnerGuard, ResourceOwner } from '../../auth/Guards/is-owner.guard';
import { Payload } from '@prisma/client/runtime/library';
import { ExtractPayload, checkOwnerThrow, isOwner } from '../../auth/extract-payload.decorator';
import { Role, RoleGuard } from '../../auth/Guards/role.guard';
import { UserType } from '@prisma/client';

@Controller('alarm')
@UseGuards(JwtAuthGuard)
export class AlarmController {

  constructor(private alarmService: AlarmService) {
  }
  @Post()
  @UseInterceptors(FileInterceptor('alarm',multerOptions))
  UploadFile(
    @UploadedFile(new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'mp3',
      })
      .addMaxSizeValidator({
        maxSize: 1048576, // just to you know it's possible.
      })
      .build({
        exceptionFactory(error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        },
      })) alarmFile: Express.Multer.File, @Req() request:Request  ) {

        if(!request.user) throw new InternalServerErrorException("user data should be added to the request");
        const userPayload:TokenPayload = <TokenPayload> request.user;
        return this.alarmService.addAlarm(alarmFile,userPayload);
  }

  @Get()
  @Role(UserType.ADMIN)
  @UseGuards(RoleGuard)
  async GetAlarms()
  {
    return this.alarmService.getAlarms();
  }
  @Get()
  GetAlarmFilter( @Query() query:FilterByUserID,@ExtractPayload() payload:TokenPayload )
  {
    checkOwnerThrow(query.userID,payload);
    return this.alarmService.GetAlarmFilter(query);
  }

  @Get(":id")
  async GetAlarm(@Param("id",ParseIntPipe) id:number, @ExtractPayload() payload:TokenPayload)
  {
    const alarm = await this.alarmService.GetAlarm(id);
    checkOwnerThrow(alarm.ownerID,payload);
    return alarm;
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteAlarm(@Param("id",ParseIntPipe) id:number, @ExtractPayload() payload:TokenPayload)
  {
    const alarm = await this.alarmService.GetAlarm(id);
    checkOwnerThrow(alarm.ownerID,payload);
    return this.alarmService.DeleteAlarm(id);
  }

}
