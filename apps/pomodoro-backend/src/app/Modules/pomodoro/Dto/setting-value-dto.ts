import {Template } from '@prisma/client';

export class SettingValueDTO
{
  id:number;
  settingNameID:number;
  ownerTemplateID;
  value: number;
  key:string;
  usedByTemplates:Template[]

}

