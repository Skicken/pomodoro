import { ReturnAuthUserDTO } from './../DTO/return-auth-user-dto';
import { plainToInstance } from 'class-transformer';
import { AuthenticateService } from '../Services/authenticate.service';
import { Controller, Post, Res,Req, UseGuards, Logger } from '@nestjs/common';
import { Response,Request} from 'express';
import { LocalAuthGuard } from '../Services/local-strategy.service';
@Controller('auth')
export class AuthenticationController {

  constructor(private authService:AuthenticateService){}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req, @Res({ passthrough: true }) resp: Response)
  {

        const data_login = this.authService.login(req.user);
        resp.cookie('refresh_token', data_login.refresh_token,{
          httpOnly:true,
          expires:new Date(Date.now()+60*60*1000*24*7),
          path:"api/auth",
          domain:"localhost",
          sameSite:'strict'
        })
        resp.cookie('access_token', data_login.access_token,{
          httpOnly:true,
          expires:new Date(Date.now()+60*60*1000),
          sameSite:'strict'
        })
        resp.cookie('isLogged', true,
        {
          expires:new Date(Date.now()+60*60*1000*24*7),
        })
        return plainToInstance(ReturnAuthUserDTO,data_login);
    }
    @Post("refresh")
    async refreshToken(@Req() request: Request,@Res({ passthrough: true }) resp: Response)
    {
        const userData:ReturnAuthUserDTO = await this.authService.refreshToken(request.cookies["refresh_token"]);

        resp.cookie('access_token',userData.access_token,{
          httpOnly:true,
          expires:new Date(Date.now()+60*60*1000),
          sameSite:'strict'
        })
        return plainToInstance(ReturnAuthUserDTO,userData);

    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) resp: Response)
    {
        resp.clearCookie("isLogged");
        resp.clearCookie("refresh_token",{
          domain:"localhost",
          path:"api/auth"
        });
        resp.clearCookie("access_token");

    }


}
