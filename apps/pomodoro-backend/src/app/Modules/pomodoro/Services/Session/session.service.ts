import { Injectable } from '@nestjs/common';
import { SessionFilter } from '../../Filters/SessionFilter';
import { AddSessionDTO } from '../../Dto/add-session-dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma:PrismaService){}
  GetFiltered(filter: SessionFilter) {

    return this.prisma.session.findMany({where:{
      templateID:filter.id,
      ownerID:filter.userID,
      state:filter.state,
    }})
  }
  AddSession(dto: AddSessionDTO) {
    return this.prisma.session.create({data:{
      userOwner:{connect:{id:dto.userID}},
      template:{connect:{id:dto.templateID}},
      startTime: dto.startDate,
      endTime: dto.endDate,
      state:dto.state
    }});
  }


}
