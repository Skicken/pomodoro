import { UserType } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/Services/jwt-strategy.service';
import { SettingNameService } from './../../Services/SettingName/settingname.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role, RoleGuard } from '../../../auth/Guards/role.guard';
import { AddSettingName } from '../../Dto/add-settingname-dto';

@Controller('setting-name')
@UseGuards(JwtAuthGuard)
export class SettingNameController {
  constructor(private settingNameService: SettingNameService) {}

  @Get(':id')
  GetSettingName(@Param('id', ParseIntPipe) id: number) {
    return this.settingNameService.GetSettingName(id);
  }
  @Get()
  GetSettingNames() {
    return this.settingNameService.GetSettingNames();
  }

  @Delete(':id')
  @Role(UserType.ADMIN)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  async DeleteSettingName(@Param('id', ParseIntPipe) id: number) {
    this.settingNameService.DeleteSettingName(id);
  }
  @Post()
  @Role(UserType.ADMIN)
  @UseGuards(RoleGuard)
  AddSettingName(@Body() dto: AddSettingName) {
    return this.settingNameService.AddSettingName(dto);
  }
}
