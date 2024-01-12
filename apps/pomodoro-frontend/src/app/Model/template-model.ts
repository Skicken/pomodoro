
export interface Setting
{
  id:number,
  settingNameID:number,
  key:string,
  value: number,

}

export const GetKeyFromTemplate = (key:string,template:Template) : Setting | undefined =>
{
  return template.settings.find((element)=>{return element.key==key});
}
export const SetKeyTemplate = (key:string,value:number,template:Template) :void =>
{
  const setting = template.settings.find((element)=>{return element.key==key});
  if(setting)
    setting.value = value;
  else
    console.error("Could not find setting with: ",key)
}


export class Template{
  id:number = 0;
  settings:Setting[] = [];
  isDefault:boolean = false;
  name:string = "";
  public constructor(init?:Partial<Template>) {         Object.assign(this, init); }
  GetKeySetting(key:string)
  {
    return this.settings.find((element)=>{return element.key==key});
  }
  GetKey(key:string):number
  {
    return this.settings.find((element)=>{return element.key==key})!.value;
  }
}
