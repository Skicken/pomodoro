import { Exclude } from "class-transformer";
import { ReturnUserDTO } from "../../pomodoro/Dto/user/user-dto";

export class AuthUserDTO extends ReturnUserDTO  {
  @Exclude()
  access_token:string;
  @Exclude()
  refresh_token:string;
}
