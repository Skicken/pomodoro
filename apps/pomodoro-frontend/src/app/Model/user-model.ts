import { UserType } from '@prisma/client';
export interface User
{
  id:number,
  userType:UserType
  email:string,
  nickname:string,
  spotifyIntegrated:boolean
}
