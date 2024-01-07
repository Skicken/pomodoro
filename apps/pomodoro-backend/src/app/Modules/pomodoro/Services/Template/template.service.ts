import { UpdateTemplateDTO } from './../../Dto/update-template-dto';
import { SettingValueService } from './../SettingValue/settingvalue.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AddTemplateDTO } from '../../Dto/add-template-dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingDTO } from '../../Dto/add-setting-dto';
import { TemplateFilter } from '../../Filters/TemplateFilter';
import { TokenPayload } from '../../../auth/Services/authenticate.service';
import { checkOwnerThrow } from '../../../auth/Guards/extract-payload.decorator';

@Injectable()
export class TemplateService {
  async DeleteTemplate(id: number) {
    const template = await this.prisma.template.findFirst({
      where: { id: id },
    });
    if (!template) return;

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
      include: {
        template_SettingValue: true,
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
  async MapSettingTemplate(
    id: number,
    from: number,
    to: number,
    payload: TokenPayload
  ) {
    const fromSetting = await this.settingValueService.GetSetting(from);
    const toSetting = await this.settingValueService.GetSetting(from);
    const ownerFromTemplate = await this.GetTemplate(
      fromSetting.ownerTemplateID
    );
    const ownerToTemplate = await this.GetTemplate(toSetting.ownerTemplateID);

    checkOwnerThrow(ownerFromTemplate.userID, payload);
    checkOwnerThrow(ownerToTemplate.userID, payload);

    return this.prisma.template.update({
      where: { id: id },
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

  async GetTemplateFilter(filter: TemplateFilter) {
    return this.prisma.template.findMany({
      where: {
        userID: filter.userID,
      },
      include: {
        template_SettingValue: true,
      },
    });
  }
}
