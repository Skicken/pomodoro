import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { SettingNameService } from '../Services/SettingName/settingname.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

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
}
