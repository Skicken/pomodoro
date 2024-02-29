
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddSettingName {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()


    @IsNumber()
    defaultValue:number
}

