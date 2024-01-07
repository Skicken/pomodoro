import { UserType } from "@prisma/client";
import { Length, IsEnum, IsOptional } from "class-validator";

export class UpdateUserDTO {

    @IsOptional()
    @Length(5,20)
    nickname?:string;

    @IsOptional()
    @Length(5,20)
    password?:string;

    @IsOptional()
    spotifyToken?:string
}



