import { SettingType, Template } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
export class UpdateSettingDTO
{
  @IsNotEmpty()
  value:string

}
