import { IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class MapSettingDTO {


    @IsNumber()
    from:number;

    @IsNumber()
    to:number;

}

