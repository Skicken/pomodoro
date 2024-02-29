import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingName } from '../../Dto/add-settingname-dto';

@Injectable()
export class SettingNameService {

  constructor(private prisma:PrismaService){}
  async GetSettingName(id: number) {
    const result  =  await this.prisma.settingName.findFirst({where:{id:id}});
    if(!result) throw new NotFoundException("SettingName could not be found");
    return result;
  }
  async GetSettingNames() {
    return await this.prisma.settingName.findMany();
  }
  async DeleteSettingName(id: number) {
    await this.prisma.settingName.deleteMany({where:{id:id}})
  }
  AddSettingName(dto: AddSettingName) {
    return this.prisma.settingName.create({data:{
      name:dto.name,
      defaultValue:dto.defaultValue
    }}).catch(()=>{
      throw new NotFoundException("Setting name already exists");
    })


  }




}
