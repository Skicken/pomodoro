
import { Session } from "../Model/session-model";
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
export const DeleteStorageUser = ()=>{

  localStorage.removeItem("user");
}
export const DeleteStorageTemplate= ()=>
{
  localStorage.removeItem("selectedTemplate");
}
export const SaveStorageSessions = (session:Session[])=>{
  localStorage.setItem("sessions",JSON.stringify(session))

}
export const DeleteStorageSessions= ()=>
{
  localStorage.removeItem("sessions");
}

export const GetStorageSessions = ()=>{

  const sessionsStorage = localStorage.getItem("sessions")
  if(sessionsStorage)
  {
    return <Session[]> JSON.parse(sessionsStorage);
  }
  return undefined;
}
