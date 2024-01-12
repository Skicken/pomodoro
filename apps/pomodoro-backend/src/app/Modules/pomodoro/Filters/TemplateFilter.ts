import { IsBoolean, IsNumber } from "class-validator";

export class TemplateFilter
{


  @IsNumber()
  userID?:number
  @IsBoolean()
  isDefault?:boolean

}
