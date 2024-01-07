
export interface Setting
{
  id:number,
  settingNameID:number,
  key:string,
  value: string | number,

}
export class Template{

  id:number = 0;
  settings:Setting[] = [];
  isDefault:boolean = false;
  templateName:string = ""

  constructor() {}
  Get(key:string) : Setting | undefined
  {
    return this.settings.find((element)=>{return element.key==key});
  }
  Replace(key:string,setting:Setting)
  {
    this.settings.map((value)=>{return value.key==key?setting:value});
  }

}
