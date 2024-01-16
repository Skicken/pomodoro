import { PomodoroState } from "@prisma/client";
import { IsDate, IsEnum, IsNumber } from "class-validator";

export class AddSessionDTO
{
  @IsDate()
  startDate:Date;

  @IsDate()
  endDate:Date;

  @IsEnum(PomodoroState)
  state:PomodoroState

  @IsNumber()
  templateID:number;

}
