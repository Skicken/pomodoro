import { UserType } from "@prisma/client";

export class  ReturnUserDTO
{
  id:number;
  nickname:string;
  email:string;
  userType:UserType
  spotifyToken: string;

}
