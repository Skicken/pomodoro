import { PrismaService } from '../../../prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {Multer} from 'multer'
import { TokenPayload } from '../../../auth/Services/authenticate.service';

import { FilterByUserID } from '../../Filters/FilterByUserID';

@Injectable()
export class AlarmService {
  getAlarms() {
    return this.prisma.alarm.findMany();
  }


  constructor(private prisma:PrismaService){

  }
  async GetAlarm(id: number) {
    const alarm =  await this.prisma.alarm.findFirst({where:{id:id}});
    if(!alarm)  throw new NotFoundException("Alarm not found")
    return alarm;
  }
  async GetAlarmFilter(query: FilterByUserID) {
    return await this.prisma.alarm.findMany({where:{ownerID:query.userID}});
  }
  async DeleteAlarm(id: number) {

      await this.prisma.alarm.delete({where:{id:id}}).catch(() => {
        throw new NotFoundException(`Alarm does not exits already`);
      });

  }
  addAlarm(alarmFile: Express.Multer.File, userPayload: TokenPayload) {

    const alarmName = alarmFile.originalname.split(".").at(0);
    if(alarmName.length>=30)
    {
        throw new BadRequestException("alarm name is too long");
    }
    return this.prisma.alarm.create({
      data:{
          urlPath:alarmFile.path,
          ownerID: userPayload.sub,
          name:alarmName,
      }
    });
  }


}
