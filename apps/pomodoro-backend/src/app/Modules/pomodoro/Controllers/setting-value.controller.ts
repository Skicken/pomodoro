import { TemplateService } from '../Services/Template/template.service';
import { SettingValueService } from '../Services/SettingValue/settingvalue.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { SettingValueFilter } from '../Filters/SettingValueFilter';
import { UpdateSettingDTO } from '../Dto/setting-value/update-setting-dto';
import {
  ExtractPayload,
  checkOwnerThrow,
} from '../../auth/Guards/extract-payload.decorator';
import { TokenPayload } from '../../auth/Services/authenticate.service';

@Controller('setting-value')
@UseGuards(JwtAuthGuard)
export class SettingValueController {
  constructor(
    private settingService: SettingValueService,
    private templateService: TemplateService
  ) {}

  @Get(':id')
  async GetSetting(
    @Param('id', ParseIntPipe) id: number,
    @ExtractPayload() payload: TokenPayload
  ) {
    const setting = await this.settingService.GetSetting(id);
    const template = await this.templateService.GetTemplate(
      setting.ownerTemplateID
    );
    checkOwnerThrow(template.id, payload);
    return this.settingService.GetSetting(id);
  }

  @Get()
  async GetSettingFilter(
    @Query() filter: SettingValueFilter,
    @ExtractPayload() payload: TokenPayload
  ) {
    const template = await this.templateService.GetTemplate(filter.templateID);
    checkOwnerThrow(template.userID, payload);
    return this.settingService.GetSettingsFiltered(filter);
  }

  @Put(':id')
  async UpdateSetting(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSettingDTO,
    @ExtractPayload() payload: TokenPayload
  ) {
    const setting = await this.settingService.GetSetting(id);
    const template = await this.templateService.GetTemplate(
      setting.ownerTemplateID
    );
    checkOwnerThrow(template.userID, payload);
    if(!this.settingService.IsValidValueUpdate(dto.value,setting))
    {
      throw new BadRequestException("Invalid new value");
    }
    return this.settingService.UpdateSetting(id, dto);
  }
}
