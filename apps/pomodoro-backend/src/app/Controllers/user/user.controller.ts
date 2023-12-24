import { Validate } from 'class-validator';
import { AddUserDTO } from '../../Dto/add-user-dto';
import { UserService } from './../../Services/User/user.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {

    constructor(private userService:UserService){}
    @Post()
    addUser(@Body() dto:AddUserDTO)
    {
      return this.userService.addUser(dto);
    }

    // @Get()
    // getUser(@Param() filter:UserFilter)
    // {


    // }

}
