import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddUserDTO } from '../../Dto/add-user-dto';
import { ReturnUserDTO } from '../../Dto/user-dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}


  private returnUser(user:User):ReturnUserDTO
  {
    const userInfo: ReturnUserDTO = new ReturnUserDTO();
    userInfo.email = user.email;
    userInfo.nickname = user.nickname;
    userInfo.id = user.id;
    userInfo.userType = user.userType;
    console.log(userInfo);
    return userInfo;
  }
  addUser(dto:AddUserDTO)
  {
    //TODO: encrypt password
    //TODO: user needs to be an admin to create another admin
    return this.prisma.user.create({
      data:{
        email:dto.email,
        password:dto.password,
        userType:dto.userType,
        nickname:dto.nickname,
      },
    }).then(user=>{

        return this.returnUser(user);
    });
  }


}
