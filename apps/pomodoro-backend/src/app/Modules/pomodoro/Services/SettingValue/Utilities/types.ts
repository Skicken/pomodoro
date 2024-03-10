import { SettingType } from "@prisma/client";

export const ParseType=(value:string ,type:SettingType)=>
{
  switch(type)
  {
    case 'NUMBER':
      return parseInt(value);
    case 'STRING':
      return value.toString();
    default:
    return undefined;
  }
}
export const IsValidType=(value:string  ,type:SettingType)=>
{
  switch(type)
  {
    case 'NUMBER':
      return Number.isInteger(value);
    case 'STRING':
      return true;
    default:
    return undefined;
  }
}
