
import { SettingType } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class AddSettingName {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    @IsEnum(SettingType)
    type:SettingType

    @IsNotEmpty()
    defaultValue:string
}

