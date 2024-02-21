import { IsNotEmpty, IsNumber } from 'class-validator';
export class AddSettingDTO
{

  @IsNotEmpty()
  value:number

  @IsNumber()
  settingNameID:number;

  @IsNumber()
  ownerTemplateID:number;
}
