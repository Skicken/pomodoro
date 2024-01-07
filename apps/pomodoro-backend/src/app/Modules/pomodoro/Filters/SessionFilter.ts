import { PomodoroState } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";

export class SessionFilter
{
  @IsNumber()
  userID:number

  @IsNumber()
  @IsOptional()
  templateID:number

  @IsOptional()
  id?:number;

  @IsOptional()
  SortDate : "asc" | "desc";

  @IsOptional()
  @IsEnum(PomodoroState)
  state:PomodoroState
}
