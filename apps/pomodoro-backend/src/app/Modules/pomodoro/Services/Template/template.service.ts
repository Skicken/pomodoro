import { UpdateTemplateDTO } from '../../Dto/template/update-template-dto';
import { SettingValueService } from './../SettingValue/settingvalue.service';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AddTemplateDTO } from '../../Dto/template/add-template-dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingDTO } from '../../Dto/setting-value/add-setting-dto';
import { TemplateFilter } from '../../Filters/TemplateFilter';
import { TokenPayload } from '../../../auth/Services/authenticate.service';
import { checkOwnerThrow } from '../../../auth/Guards/extract-payload.decorator';
import { Prisma, SettingValue, Template } from '@prisma/client';

export type TemplateWithSettings = Prisma.TemplateGetPayload<{
  include: {template_SettingValue: true};
}>;
@Injectable()
export class TemplateService {
  constructor(
    private prisma: PrismaService,
    private settingValueService: SettingValueService
  ) {}

  async DeleteTemplate(id: number) {
    const template:TemplateWithSettings = await this.prisma.template.findFirst({
      where: { id: id },
      include: {
        template_SettingValue: true,
      }
    });
    if (!template) return;
    const templates:TemplateWithSettings[] = await this.prisma.template.findMany({
      where:{
        NOT: {
          id: id
        },AND:{
          template_SettingValue:
          {
            some:
            {
              ownerTemplateID:id
            }
          }
        }
      },
      include: {
        template_SettingValue: true,
      }

    });
    templates.forEach(element => {
      element.template_SettingValue.forEach(async setting => {
        if(setting.ownerTemplateID==id)
        {
           const templateOwnedSetting:SettingValue = await this.prisma.settingValue.findFirst({where:{
            ownerTemplateID:element.id,
            settingNameID:setting.settingNameID
           }})
           this.MapSetting(element.id,setting.id,templateOwnedSetting.id);
        }
      });
    });
    Logger.debug(`deleting template ${id}`)
    return await this.prisma.template.deleteMany({ where: { id: id } });
  }
  async GetTemplate(id: number) {

    const template = await this.prisma.template.findFirst({
      where: { id: id },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }


  async AddTemplate(userID: number, dto: AddTemplateDTO) {
    const template = await this.prisma.template.create({
      data: {
        userID: userID,
        templateName: dto.templateName,
        isDefault: false,
      },
    });

    const defaultTemplate = await this.GetUserDefault(userID);

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
    });
  }


  async CreateUserDefault(userID: number) {
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
  async GetUserDefault(userID: number) {
    const defaultExists = await this.prisma.template.findFirst({
      where: {
        userID: userID,
        isDefault: true,
      },
      include: {
        template_SettingValue: true,
      },
    });
    if (defaultExists) return defaultExists;
    return this.CreateUserDefault(userID);
  }
  UpdateTemplate(id: number, dto: UpdateTemplateDTO) {
    return this.prisma.template.update({
      where: { id: id },
      data: {
        templateName: dto.templateName,
      },
    });
  }

  async MapSetting(templateID:number,from:number,to:number)
  {

    return this.prisma.template.update({
      where: { id: templateID },
      data: {
        template_SettingValue: {
          disconnect: { id: from },
          connect: { id: to },
        },
      },
      include: {
        template_SettingValue: true,
      },
    });

  }


  async MapSettingTemplate(
    id: number,
    from: number,
    to: number,
    payload: TokenPayload
  ) {
    const fromSetting = await this.settingValueService.GetSetting(from);
    const toSetting = await this.settingValueService.GetSetting(to);
    const ownerFromTemplate = await this.GetTemplate(
      fromSetting.ownerTemplateID
    );
    const ownerToTemplate = await this.GetTemplate(toSetting.ownerTemplateID);

    checkOwnerThrow(ownerFromTemplate.userID, payload);
    checkOwnerThrow(ownerToTemplate.userID, payload);

    if(fromSetting.settingNameID!=toSetting.settingNameID) throw new BadRequestException("Invalid setting mapping, template can only have one instance of specific setting name");

    return this.MapSetting(id,from,to);
  }
 async MapSettingSelf(templateID:number,from:number)
 {
  const fromSetting = await this.settingValueService.GetSetting(from);
  const toSetting = await this.prisma.settingValue.findFirst({where:{
    ownerTemplateID:templateID,
    settingNameID:fromSetting.settingNameID,
  }})
  return this.MapSetting(templateID,fromSetting.id,toSetting.id);
 }
  async GetTemplateFilter(filter: TemplateFilter):Promise<Template[]> {
    if(filter.isDefault)
    {
      return [await this.GetUserDefault(filter.userID)];
    }
    return this.prisma.template.findMany({
      where: {
        userID: filter.userID,
        isDefault:filter.isDefault
      },
    });
  }
}
