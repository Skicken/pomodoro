import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {Multer} from 'multer'
import { AddAlarmDto } from '../../Dto/add-alarm-dto';
@Injectable()
export class AlarmService {

  constructor(private prisma:PrismaService){

  }
  addAlarm(alarm: Express.Multer.File, dto: AddAlarmDto) {


      return this.prisma.alarm.create({
        data:{
            urlPath:alarm.path,
            ownerID: parseInt(dto.ownerID),
            name:( dto.name && dto.name.trim().length>=5)?dto.name:alarm.originalname.split(".").at(0),
        }
    })
  }
}
