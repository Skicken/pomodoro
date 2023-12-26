import { User, $Enums } from "@prisma/client";
import { Exclude } from "class-transformer";

export class  ReturnUserDTO implements User
{
  id: number;
  createdAt: Date;
  userType: $Enums.UserType;
  nickname: string;
  email: string;
  spotifyToken: string;
  @Exclude()
  password:string

}
