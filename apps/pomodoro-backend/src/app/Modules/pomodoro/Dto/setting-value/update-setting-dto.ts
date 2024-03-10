import { IsString } from 'class-validator';
export class UpdateSettingDTO
{
  @IsString()
  value:string

}
