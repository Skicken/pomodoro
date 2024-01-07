import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, Length } from "class-validator";

export class  AddUserDTO
{
  @Length(5,20)
  @IsNotEmpty()
  nickname:string;
  @Length(5,20)
  @IsNotEmpty()
  password:string;
  @IsEmail()
  @IsNotEmpty()
  email:string;

}
