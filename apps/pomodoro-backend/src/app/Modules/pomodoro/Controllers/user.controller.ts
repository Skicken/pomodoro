import { ExtractPayload, checkOwnerThrow } from '../../auth/Guards/extract-payload.decorator';

import { UserService } from '../Services/User/user.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AddUserDTO } from '../Dto/add-user-dto';
import { Role, RoleGuard } from '../../auth/Guards/role.guard';
import { UserType } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';

import { TokenPayload } from '../../auth/Services/authenticate.service';
import { UpdateUserDTO } from '../Dto/update-user-dto';
import { TemplateService } from '../Services/Template/template.service';

@Controller('user')
export class UserController {

    constructor(private userService:UserService,private templateService:TemplateService){}
    @Post()
    async addUser(@Body() dto:AddUserDTO)
    {
      const user = await this.userService.addUser(dto);
      if(user) this.templateService.CreateUserDefault(user.id)
      return user;
    }
    @Get(":id")
    @Role(UserType.USER)
    @UseGuards(JwtAuthGuard,RoleGuard)
    getUser(@Param("id",ParseIntPipe) id:number,@ExtractPayload() payload:TokenPayload )
    {
      checkOwnerThrow(id,payload);
      return this.userService.getUser(id);
    }
    @Get()
    @Role(UserType.ADMIN)
    @UseGuards(JwtAuthGuard,RoleGuard)
    getUsers()
    {
      return this.userService.getUsers();
    }
    @Put(":id")
    @Role(UserType.USER)
    @UseGuards(JwtAuthGuard,RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    updateUser(@Param("id",ParseIntPipe) id:number,@Body() dto:UpdateUserDTO,@ExtractPayload() payload:TokenPayload )
    {
      checkOwnerThrow(id,payload)
      return this.userService.updateUser(id,dto);
    }
    @Delete(":id")
    @Role(UserType.USER)
    @UseGuards(JwtAuthGuard,RoleGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Param("id",ParseIntPipe) id:number,@Body() dto:UpdateUserDTO,@ExtractPayload() payload:TokenPayload )
    {
      checkOwnerThrow(id,payload)
      return this.userService.deleteUser(id);
    }

}
