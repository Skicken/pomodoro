import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class TemplateFilter
{
  @IsOptional()
  @IsBoolean()
  default?:boolean

  @IsNumber()
  userID?:number

  @IsOptional()
  @IsNumber()
  id?:number;
}
