import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingValueFilter } from '../../Filters/SettingValueFilter';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddSettingDTO } from '../../Dto/setting-value/add-setting-dto';
import { UpdateSettingDTO } from '../../Dto/setting-value/update-setting-dto';
import { SettingNameService } from '../SettingName/settingname.service';
import {
  Prisma,
  SettingName,
  SettingType,
  TableIDConstraint,
} from '@prisma/client';
import { SettingValueDTO } from '../../Dto/setting-value/setting-value-dto';
import { IsValidType, ParseType } from './Utilities/types';
type SettingValueInclude = Prisma.SettingValueGetPayload<{
  include: { settingName: true; settingValue_Template: true };
}>;
@Injectable()
export class SettingValueService {

  constructor(
    private prisma: PrismaService,
    private settingNameService: SettingNameService
  ) {}

  /**
   *
   * @param setting
   * @returns Flattened Setting Value Data
   */
  MapSettingDTO(setting: SettingValueInclude): SettingValueDTO {
    return <SettingValueDTO>{
      settingNameID: setting.settingNameID,
      id: setting.id,
      ownerTemplateID: setting.ownerTemplateID,
      key: setting.settingName.name,
      value: ParseType(setting.value,setting.settingName.type) ,
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
    newValue: string,
    settingValue: SettingValueDTO
  ): Promise<boolean> {

    const settingName: SettingName =
      await this.settingNameService.GetSettingName(settingValue.settingNameID);
    if(!IsValidType(newValue,settingName.type)) return false;

    if(settingName.type!=SettingType.NUMBER)
    {
      return true;
    }
    const value = parseInt(newValue);
    if (
      settingName.constraint === TableIDConstraint.NO_CONSTRAINT &&
      (settingName.minValue > value || settingName.maxValue < value)
    ) {
      return false;
    }
    switch (settingName.constraint) {
      case 'NO_CONSTRAINT':
        return true;
      case 'TEMPLATE_ID': {
        return (
          (await this.prisma.template.count({ where: { id: value } })) > 0
        );
      }
      case 'ALARM_ID': {
        return (await this.prisma.alarm.count({ where: { id: value } })) > 0;
      }
      default:
        return true;
    }

  }
  async ResetSettingToDefault(
    SettingName: string,
    WhereValue:string | undefined
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
