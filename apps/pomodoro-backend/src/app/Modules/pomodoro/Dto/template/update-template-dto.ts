import { SettingValue } from '@prisma/client';
import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UpdateTemplateDTO {



    @IsOptional()
    @MinLength(5)
    templateName:string

}

