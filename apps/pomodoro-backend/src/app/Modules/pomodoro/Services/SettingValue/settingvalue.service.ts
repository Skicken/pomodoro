import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingValueFilter } from '../../Filters/SettingValueFilter';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingDTO } from '../../Dto/add-setting-dto';
import { UpdateSettingDTO } from '../../Dto/update-setting-dto';
import { SettingNameService } from '../SettingName/settingname.service';
import { Prisma, SettingName } from '@prisma/client';
import { SettingValueDTO } from '../../Dto/setting-value-dto';
type SettingValueInclude = Prisma.SettingValueGetPayload<{
  include: { settingName: true, settingValue_Template:true  };
}>;
@Injectable()
export class SettingValueService {


  MapSettingDTO(setting: SettingValueInclude): SettingValueDTO {
    return <SettingValueDTO>{
      settingNameID: setting.settingNameID,
      id: setting.id,
      ownerTemplateID: setting.ownerTemplateID,
      key: setting.settingName.name,
      value: setting.value,
      usedByTemplates:setting.settingValue_Template

    };
  }
  async GetSetting(id: number) {
    const setting = await this.prisma.settingValue.findFirst({
      where: { id: id },
      include: {
        settingName: true,
        settingValue_Template:true
      },
    });

    if (!setting) throw new NotFoundException('Setting could not be found');
    return this.MapSettingDTO(setting);
  }
  constructor(
    private prisma: PrismaService,
    private settingNameService: SettingNameService
  ) {}
  async GetSettingsFiltered(filter: SettingValueFilter) {
    return (
      await this.prisma.settingValue.findMany({
        where: {
          settingValue_Template: {
            some: {
              id: filter.templateID,
            },
          },
          settingName:{
            name:filter.key
          }
        },
        include: {
          settingName: true,
          settingValue_Template:true,
        },
      })
    ).map((setting) => {
      return this.MapSettingDTO(setting);
    });
  }
  GetSettings() {
    return this.prisma.settingValue.findMany();
  }

  async GetServerDefaultsFor(templateID: number) {
    const settingNames: SettingName[] =
      await this.settingNameService.GetSettingNames();
    const values: AddSettingDTO[] = settingNames.map((value) => {
      const settingValue: AddSettingDTO = {
        settingNameID: value.id,
        value: value.defaultValue,
        ownerTemplateID: templateID,
      };
      return settingValue;
    });
    return values;
  }
  async UpdateSetting(id: number, dto: UpdateSettingDTO) {

    return await this.prisma.settingValue.update({
      where: {
        id: id,
      },
      data: {
        value: dto.value,
      },
    });
  }
}
