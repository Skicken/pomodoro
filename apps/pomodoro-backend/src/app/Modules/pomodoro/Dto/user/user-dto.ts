import { $Enums } from "@prisma/client";
import { Exclude } from "class-transformer";

export class  ReturnUserDTO
{
  id: number;
  createdAt: Date;
  userType: $Enums.UserType;
  nickname: string;
  email: string;
  spotifyIntegrated:boolean;
  @Exclude()
  password:string

}
