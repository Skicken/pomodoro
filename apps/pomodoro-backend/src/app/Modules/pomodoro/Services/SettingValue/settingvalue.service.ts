import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingValueFilter } from '../../Filters/SettingValueFilter';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingDTO } from '../../Dto/setting-value/add-setting-dto';
import { UpdateSettingDTO } from '../../Dto/setting-value/update-setting-dto';
import { SettingNameService } from '../SettingName/settingname.service';
import {
  Prisma,
  SettingName,
  SettingValue,
  TableIDConstraint,
} from '@prisma/client';
import { SettingValueDTO } from '../../Dto/setting-value/setting-value-dto';
type SettingValueInclude = Prisma.SettingValueGetPayload<{
  include: { settingName: true; settingValue_Template: true };
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
      usedByTemplates: setting.settingValue_Template,
    };
  }
  async GetSetting(id: number) {
    const setting = await this.prisma.settingValue.findFirst({
      where: { id: id },
      include: {
        settingName: true,
        settingValue_Template: true,
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
          settingName: {
            name: filter.key,
          },
        },
        include: {
          settingName: true,
          settingValue_Template: true,
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

  async IsValidValueUpdate(
    newValue: number,
    settingValue: SettingValue
  ): Promise<boolean> {
    const settingName: SettingName =
      await this.settingNameService.GetSettingName(settingValue.settingNameID);

    if (
      settingName.constraint === TableIDConstraint.NO_CONSTRAINT &&
      (settingName.minValue > newValue || settingName.maxValue < newValue)
    ) {
      return false;
    }

    switch (settingName.constraint) {
      case 'NO_CONSTRAINT':
        return true;
      case 'TEMPLATE_ID': {
        return (
          (await this.prisma.template.count({ where: { id: newValue } })) > 0
        );
      }
      case 'ALARM_ID': {
        return (await this.prisma.alarm.count({ where: { id: newValue } })) > 0;
      }
      default:
        return true;
    }
  }
  async ResetSettingToDefault(
    SettingName: string,
    WhereValue:number | undefined
  ) {
    const settingName: SettingName =
      await this.prisma.settingName.findUniqueOrThrow({
        where: { name: SettingName },
      });
    return await this.prisma.settingValue.updateMany({
      data: { value: settingName.defaultValue },
      where: {
        value:WhereValue
      },
    });
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
