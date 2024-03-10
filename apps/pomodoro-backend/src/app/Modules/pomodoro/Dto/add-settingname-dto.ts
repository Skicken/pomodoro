
import { IsNotEmpty } from "class-validator";

export class AddSettingName {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()


    defaultValue:string
}

