import { IsNotEmpty, MinLength } from "class-validator";

export class AddTemplateDTO {

    @IsNotEmpty()
    @MinLength(5)
    templateName:string
}

