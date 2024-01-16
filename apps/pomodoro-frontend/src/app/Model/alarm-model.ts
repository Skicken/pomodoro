export interface Alarm
{
  id:number;
  name:string,
  urlPath:string
}
export const defaultAlarm:Alarm ={
  id:0,
  name: "DefaultAlarm",
  urlPath: "DefaultAlarm.mp3"
}
