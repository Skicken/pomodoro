import { Template } from "./template-model";

export enum PomodoroState
{
  SESSION,
  LONG_BREAK,
  SHORT_BREAK,
}
export interface Session
{
  state:PomodoroState,
  startTime:Date,
  endTime:Date,
  templateID:number,
  template?:Template;
}
