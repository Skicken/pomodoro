import { Exclude } from "class-transformer";
import { ReturnUserDTO } from "../../pomodoro/Dto/user-dto";

export class ReturnAuthUserDTO extends ReturnUserDTO  {
  access_token:string;
  @Exclude()
  refresh_token:string;
}
