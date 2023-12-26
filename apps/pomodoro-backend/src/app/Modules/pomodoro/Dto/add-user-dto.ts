import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, Length } from "class-validator";

export class  AddUserDTO
{
  @Length(5,20)
  nickname:string;
  @Length(5,20)
  password:string;
  @IsEmail()
  email:string;
  @IsEnum(UserType)
  userType:UserType
}
