import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class TemplateFilter
{

  @IsNumber()
  userID?:number
  @IsBoolean()
  @IsOptional()
  isDefault?:boolean

}
