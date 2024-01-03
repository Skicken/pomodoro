import { CheckPayloadOwner, ExtractPayload, checkOwnerThrow, isOwner } from '../../auth/extract-payload.decorator';
import { Validate } from 'class-validator';

import { UserService } from '../Services/User/user.service';
import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AddUserDTO } from '../Dto/add-user-dto';
import { Role, RoleGuard } from '../../auth/Guards/role.guard';
import { UserType } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { IsOwnerGuard } from '../../auth/Guards/is-owner.guard';

import { TokenPayload } from '../../auth/Services/authenticate.service';
import { UpdateUserDTO } from '../Dto/update-user-dto';

@Controller('user')
export class UserController {

    constructor(private userService:UserService){}
    @Post()
    addUser(@Body() dto:AddUserDTO)
    {
      return this.userService.addUser(dto);
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
    updateUser(@Param("id",ParseIntPipe) id:number,@Body() dto:UpdateUserDTO,@ExtractPayload() payload:TokenPayload )
    {
      checkOwnerThrow(id,payload)
      return this.userService.updateUser(id,dto);
    }
    @Delete(":id")
    @Role(UserType.USER)
    @UseGuards(JwtAuthGuard,RoleGuard)
    deleteUser(@Param("id",ParseIntPipe) id:number,@Body() dto:UpdateUserDTO,@ExtractPayload() payload:TokenPayload )
    {
      checkOwnerThrow(id,payload)
      return this.userService.deleteUser(id);
    }

}
