import { IsNumber } from 'class-validator';
export class UpdateSettingDTO
{
  @IsNumber()
  value:number

}
