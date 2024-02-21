import { Body, Controller, Post } from '@nestjs/common';
import { AddUserDTO } from '../Dto/user/add-user-dto';
import { TemplateService } from '../Services/Template/template.service';
import { UserService } from '../Services/User/user.service';

@Controller('register')
export class RegisterController {


  constructor(private userService:UserService,private templateService:TemplateService){}
  @Post()
  async addUser(@Body() dto:AddUserDTO)
  {
    const user = await this.userService.addUser(dto);
    if(user) this.templateService.CreateUserDefault(user.id)
    return user;
  }

}
