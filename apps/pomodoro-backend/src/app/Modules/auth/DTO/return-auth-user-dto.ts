import { Exclude } from "class-transformer";
import { ReturnUserDTO } from "../../pomodoro/Dto/user/user-dto";

export class ReturnAuthUserDTO extends ReturnUserDTO  {
  @Exclude()
  access_token:string;
  @Exclude()
  refresh_token:string;
}
