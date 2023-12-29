import { SettingType } from '@prisma/client';

export class SettingValueDTO
{
  id:number;
  settingNameID:number;
  ownerTemplateID;
  value: number | string | boolean;
  key:string
  type:SettingType

}

