import { Template } from "../Model/template-model";
import { User } from "../Model/user-model";

export const GetStorageUser= ():User|undefined=>{
  const userStorage =localStorage.getItem("user")
  if(userStorage)
  {
    return <User>JSON.parse(userStorage);
  }
  else return undefined;
}
export const GetStorageTemplate = ():Template | undefined=>{
  const templateStorage =localStorage.getItem("selectedTemplate")
  if(templateStorage)
  {
    return new Template(JSON.parse(templateStorage));
  }
  else return undefined;

}
export const SetStorageTemplate = (template:Template)=>{
  localStorage.setItem("selectedTemplate",JSON.stringify(template));
}
export const DeleteStorageTemplate= ()=>
{
  localStorage.removeItem("selectedTemplate");
}
