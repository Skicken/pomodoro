import { PrismaService } from '../../../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TokenPayload } from '../../../auth/Services/authenticate.service';

import { FilterByUserID } from '../../Filters/FilterByUserID';
import { Alarm } from '@prisma/client';
import { maxUserAlarms } from './multer-options';

@Injectable()
export class AlarmService {
  getAlarms() {
    return this.prisma.alarm.findMany();
  }

  constructor(private prisma: PrismaService) {}
  async GetAlarm(id: number) {
    const alarm = await this.prisma.alarm.findFirst({ where: { id: id } });
    if (!alarm) throw new NotFoundException('Alarm not found');
    return alarm;
  }
  async GetAlarmFilter(query: FilterByUserID) {
    return await this.prisma.alarm.findMany({
      where: { ownerID: query.userID },
    });
  }
  async DeleteAlarm(id: number) {
    await this.prisma.alarm.delete({ where: { id: id } });
  }
  async CanAddAlarm(userPayload: TokenPayload) {
    const alarms: Alarm[] = await this.prisma.alarm.findMany({
      where: {
        userOwner: {
          is:{
            id:userPayload.sub
          }
        },
      },
    });
    if(alarms.length>=maxUserAlarms)
    {
      return false;
    }
    return true;
  }
  AddAlarm(alarmFile: Express.Multer.File, userPayload: TokenPayload) {
    const alarmName = alarmFile.originalname.split('.').at(0);
    Logger.debug(alarmFile.destination);
    if (alarmName.length >= 30) {
      throw new BadRequestException('alarm name is too long');
    }
    return this.prisma.alarm.create({
      data: {
        urlPath: alarmFile.filename,
        ownerID: userPayload.sub,
        name: alarmName,
      },
    });
  }
}
