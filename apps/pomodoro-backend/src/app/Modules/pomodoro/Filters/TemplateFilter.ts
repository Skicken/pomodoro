import { IsNumber } from "class-validator";

export class TemplateFilter
{


  @IsNumber()
  userID?:number


}
