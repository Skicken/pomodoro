import { ReturnUserDTO } from "../../pomodoro/Dto/user-dto";

export class AuthUserDTO extends ReturnUserDTO  {
  access_token:string;
  refresh_token:string;
}
