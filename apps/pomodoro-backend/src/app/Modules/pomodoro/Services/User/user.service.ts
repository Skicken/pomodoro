import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, UserType } from '@prisma/client';
import { ReturnUserDTO } from '../../Dto/user-dto';
import { AddUserDTO } from '../../Dto/add-user-dto';
import { plainToInstance } from 'class-transformer';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '../../Dto/update-user-dto';
@Injectable()
export class UserService {

  async passwordHash(password:string)
  {
    const saltOrRounds = 10;
    return await bcrypt.hash(password,saltOrRounds);
  }
  async updateUser(userID:number,dto: UpdateUserDTO) {

    return await plainToInstance(ReturnUserDTO,this.prisma.user.update({
      where:{
        id:userID
      },
      data:{...dto,password:await this.passwordHash(dto.password)}
    }));
  }
  async deleteUser(id: number) {
    await this.prisma.user.deleteMany({where:{id:id}});
  }
  async getUsers() {

    const users: User[] =  await this.prisma.user.findMany();
    return users.map(user =>{
      return plainToInstance(ReturnUserDTO,user);
    })

  }

  async getUser(id: number) {
      const user =  await this.prisma.user.findFirst({where:{id:id}});
      if(!user) throw new NotFoundException("User could not be found");
      return plainToInstance(ReturnUserDTO,user);
  }
  constructor(private prisma: PrismaService) {}

  async addUser(dto:AddUserDTO)
  {
    Logger.debug("Adding new user");
      const user =  this.prisma.user.create({
        data:{
          email:dto.email,
          password:await this.passwordHash(dto.password),
          userType:UserType.USER,
          nickname:dto.nickname,
        },
      }).catch(()=>
      {
        throw new HttpException("User with defined email already exists",HttpStatus.CONFLICT)
      });
    return plainToInstance(ReturnUserDTO,user);
  }
}
