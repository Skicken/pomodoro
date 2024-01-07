import { ExtractPayload, checkOwnerThrow } from '../../auth/Guards/extract-payload.decorator';
import { AddTemplateDTO } from '../Dto/add-template-dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { TemplateService } from '../Services/Template/template.service';
import { TokenPayload } from '../../auth/Services/authenticate.service';
import { TemplateFilter } from '../Filters/TemplateFilter';
import { MapSettingDTO } from '../Dto/map-setting-dto';

@Controller('template')
@UseGuards(JwtAuthGuard)
export class TemplateController {

  constructor(private templateService:TemplateService){}

  @Put(":id")
  async MapSetting(@Param("id",ParseIntPipe) id:number,@Body() dto:MapSettingDTO,@ExtractPayload() payload:TokenPayload)
  {
    const template = await this.templateService.GetTemplate(id);
    checkOwnerThrow(template.userID,payload)
    return this.templateService.MapSettingTemplate(id,dto.from,dto.to,payload);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  AddTemplate(@Body() dto:AddTemplateDTO,@ExtractPayload() payload:TokenPayload)
  {
    return this.templateService.AddTemplate(payload.sub,dto);
  }
  @Get("default")
  GetDefaultTemplate(@Query() filter:TemplateFilter,@ExtractPayload() payload:TokenPayload)
  {
    checkOwnerThrow(filter.userID,payload)
    return this.templateService.GetUserDefault(filter.userID);
  }


  @Get()
  GetFilterTemplate(@Query() filter:TemplateFilter,@ExtractPayload() payload:TokenPayload)
  {
    checkOwnerThrow(filter.userID,payload)
    return this.templateService.GetTemplateFilter(filter);
  }
  @Get(":id")
  async GetTemplate(@Param("id",ParseIntPipe) id:number,@ExtractPayload() payload:TokenPayload)
  {
     const template = await this.templateService.GetTemplate(id);
     checkOwnerThrow(template.userID,payload)
     return template;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteTemplate(@Param("id",ParseIntPipe) id:number,@ExtractPayload() payload:TokenPayload)
  {
     const template = await this.templateService.GetTemplate(id);
     checkOwnerThrow(template.userID,payload)
     if(!template.isDefault)
      this.templateService.DeleteTemplate(id);
  }
}
