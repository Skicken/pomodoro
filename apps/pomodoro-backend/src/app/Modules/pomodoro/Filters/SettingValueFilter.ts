import { IsNumber, IsOptional } from "class-validator";

export class SettingValueFilter
{
  @IsNumber()
  templateID:number;

  @IsOptional()
  key:string;
}
