import { IsNumber, IsOptional } from "class-validator";

export class MapSettingDTO {


    @IsNumber()
    from:number;

    @IsOptional()
    @IsNumber()
    to:number;

}

