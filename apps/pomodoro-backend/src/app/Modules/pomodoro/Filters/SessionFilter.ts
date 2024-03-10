import { PomodoroState } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class SessionFilter
{
  @IsNumber()
  userID:number

  @IsNumber()
  @IsOptional()
  templateID?:number

  @IsOptional()
  sortDate? : "asc" | "desc";

  @IsOptional()
  @IsEnum(PomodoroState)
  state?:PomodoroState
}
