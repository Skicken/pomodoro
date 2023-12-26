import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '@prisma/client';
import { ReturnUserDTO } from '../../Dto/user-dto';
import { AddUserDTO } from '../../Dto/add-user-dto';
import { plainToInstance } from 'class-transformer';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {



  getUser(id: number) {
      const user =  this.prisma.user.findFirst({where:{id:id}});
      return plainToInstance(ReturnUserDTO,user);
  }

  constructor(private prisma: PrismaService) {}


  async addUser(dto:AddUserDTO)
  {
    //TODO: user needs to be an admin to create another admin
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(dto.password,saltOrRounds);
    Logger.debug("Adding new user");
    const user =  this.prisma.user.create({
      data:{
        email:dto.email,
        password:hash,
        userType:dto.userType,
        nickname:dto.nickname,
      },
    });
    return plainToInstance(ReturnUserDTO,user);
  }
}
