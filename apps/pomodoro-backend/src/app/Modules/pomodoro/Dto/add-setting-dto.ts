import { SettingName } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class AddSettingDTO
{

  @IsNotEmpty()
  value:string

  @IsNumber()
  settingNameID:number;

  @IsNumber()
  ownerTemplateID:number;
}
