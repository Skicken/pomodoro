import { UpdateTemplateDTO } from './../../Dto/update-template-dto';
import { SettingValueService } from './../SettingValue/settingvalue.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddTemplateDTO } from '../../Dto/add-template-dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingDTO } from '../../Dto/add-setting-dto';
import { TemplateFilter } from '../../Filters/TemplateFilter';
import { TokenPayload } from '../../../auth/Services/authenticate.service';

@Injectable()
export class TemplateService {
  DeleteTemplate(id: number) {
    this.prisma.template.deleteMany({ where: { id: id } });
  }
  async GetTemplate(id: number) {
    const template = await this.prisma.template.findFirst({
      where: { id: id },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }
  constructor(
    private prisma: PrismaService,
    private settingValueService: SettingValueService
  ) {}

  async AddTemplate(userID: number, dto: AddTemplateDTO) {
    const template = await this.prisma.template.create({
      data: {
        userID: userID,
        templateName: dto.templateName,
        isDefault: false,
      },
    });

    const defaultTemplate = (
      await this.GetTemplateFilter({ userID: userID,default:true })
    ).at(0);
    const copyValues: AddSettingDTO[] =
      defaultTemplate.template_SettingValue.map((settingValue) => {
        return <AddSettingDTO>{
          value: settingValue.value,
          ownerTemplateID: template.id,
          settingNameID: settingValue.settingNameID,
        };
      });

    return await this.prisma.template.update({
      where: {
        id: template.id,
      },
      data: {
        template_SettingValue: { create: copyValues },
      },
      include: {
        template_SettingValue: true,
      },
    });
  }
  async CreateUserDefault(userID: number) {

    const defaultExists = (
      await this.GetTemplateFilter({ userID: userID,default:true  })
    ).at(0);
    if(defaultExists) throw new BadRequestException("Default settings already exists for a user");

    const defaultTemplate = await this.prisma.template.create({
      data: {
        userOwner: { connect: { id: userID } },
        templateName: 'default',
        isDefault: true,
      },
    });
    const serverDefault: AddSettingDTO[] =
      await this.settingValueService.GetServerDefaultsFor(defaultTemplate.id);

    return await this.prisma.template.update({
      where: {
        id: defaultTemplate.id,
      },
      data: {
        template_SettingValue: { create: serverDefault },
      },
      include: {
        template_SettingValue: true,
      },
    });
  }
  UpdateTemplate(id: number, dto: UpdateTemplateDTO) {
    return this.prisma.template.update({
      where: { id: id },
      data: {
        templateName: dto.templateName,
      },
    });
  }
  async MapSettingTemplate(id:number,from:number,to:number,payload:TokenPayload)
  {
    const fromSetting = await this.settingValueService.GetSetting(from)
    const toSetting = await this.settingValueService.GetSetting(from)
    const ownerFromTemplate = await this.GetTemplate(fromSetting.ownerTemplateID);
    const ownerToTemplate = await this.GetTemplate(toSetting.ownerTemplateID);


    return this.prisma.template.update({
      where: { id: id },
      data: {
        template_SettingValue:{
          disconnect:{id:from},
          connect:{id:to}

        }
      },
      include: {
        template_SettingValue: true,
      }
    });
  }

  GetTemplateFilter(filter: TemplateFilter) {
    return this.prisma.template.findMany({
      where: {
        userID: filter.userID,
        id: filter.id,
        isDefault: filter.default,
      },
      include: {
        template_SettingValue: true,
      },
    });
  }
}
