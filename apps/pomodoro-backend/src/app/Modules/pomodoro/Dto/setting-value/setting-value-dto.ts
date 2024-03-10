import {Template } from '@prisma/client';

export class SettingValueDTO
{
  id:number;
  settingNameID:number;
  ownerTemplateID;
  value: string;
  key:string;

   /**
    * Might be excessive parameter, but it's needed in the frontend to show bindings.
    */
  usedByTemplates:Template[]

}

