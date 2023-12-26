import { Validate } from 'class-validator';

import { UserService } from './../../Services/User/user.service';
import { Body, Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AddUserDTO } from '../../Dto/add-user-dto';
import { Role, RoleGuard } from '../../../auth/Guards/role.guard';
import { UserType } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/Services/jwt-strategy.service';
import { IsOwnerGuard } from '../../../auth/Guards/is-owner.guard';

@Controller('user')
export class UserController {

    constructor(private userService:UserService){}
    @Post()
    addUser(@Body() dto:AddUserDTO)
    {
      return this.userService.addUser(dto);
    }
    @Get()
    @Role(UserType.USER)
    @UseGuards(JwtAuthGuard,RoleGuard,IsOwnerGuard)
    getUser(@Query('userID') id:number )
    {
      Logger.debug(id);
      return this.userService.getUser(id);
    }
    // @Get()
    // getUser(@Param() filter:UserFilter)
    // {


    // }

}
