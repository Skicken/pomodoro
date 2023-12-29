import { ExtractPayload, checkOwnerThrow } from './../../../auth/extract-payload.decorator';
import { AddTemplateDTO } from './../../Dto/add-template-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/Services/jwt-strategy.service';
import { TemplateService } from '../../Services/Template/template.service';
import { TokenPayload } from '../../../auth/Services/authenticate.service';
import { TemplateFilter } from '../../Filters/TemplateFilter';

@Controller('template')
@UseGuards(JwtAuthGuard)
export class TemplateController {

  constructor(private templateService:TemplateService){}
  @Post("default")
  AddDefault(@Body() dto:AddTemplateDTO,@ExtractPayload() payload:TokenPayload)
  {
    return this.templateService.CreateUserDefault(payload.sub);
  }

  @Post()
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
  async DeleteTemplate(@Param("id",ParseIntPipe) id:number,@ExtractPayload() payload:TokenPayload)
  {
     const template = await this.templateService.GetTemplate(id);
     checkOwnerThrow(template.userID,payload)
     if(!template.isDefault)
      this.templateService.DeleteTemplate(id);
  }
}
