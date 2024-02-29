export interface Alarm
{
  id:number;
  name:string,
  urlPath:string,
  isDefault:boolean,
}
export const defaultAlarm:Alarm ={
  id:0,
  name: "DefaultAlarm",
  urlPath: "DefaultAlarm.mp3",
  isDefault:true,
}
