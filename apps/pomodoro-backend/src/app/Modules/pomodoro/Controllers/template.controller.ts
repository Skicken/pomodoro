import { ExtractPayload, checkOwnerThrow, checkOwnerThrowIgnoreAdmin } from '../../auth/Guards/extract-payload.decorator';
import { AddTemplateDTO } from '../Dto/add-template-dto';
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { TemplateService } from '../Services/Template/template.service';
import { TokenPayload } from '../../auth/Services/authenticate.service';
import { TemplateFilter } from '../Filters/TemplateFilter';
import { MapSettingDTO } from '../Dto/map-setting-dto';

@Controller('template')
@UseGuards(JwtAuthGuard)
export class TemplateController {

  constructor(private templateService:TemplateService){}
  @Get("default")
  GetDefaultTemplate(@Query() filter:TemplateFilter,@ExtractPayload() payload:TokenPayload)
  {
    checkOwnerThrow(filter.userID,payload)
    return this.templateService.GetUserDefault(filter.userID);
  }

  @Put(":id")
  async MapSetting(@Param("id",ParseIntPipe) id:number,@Body() dto:MapSettingDTO,@ExtractPayload() payload:TokenPayload)
  {
    const template = await this.templateService.GetTemplate(id);
    checkOwnerThrowIgnoreAdmin(template.userID,payload)
    if(template.isDefault) throw new BadRequestException("cannot map default template");
    if(dto.to)
      return this.templateService.MapSettingTemplate(id,dto.from,dto.to,payload);
    return this.templateService.MapSettingSelf(id,dto.from);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  AddTemplate(@Body() dto:AddTemplateDTO,@ExtractPayload() payload:TokenPayload)
  {
    return this.templateService.AddTemplate(payload.sub,dto);
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
     if(template.isDefault) throw new BadRequestException("cannot delete default setting");
     return this.templateService.DeleteTemplate(id);
  }
}
