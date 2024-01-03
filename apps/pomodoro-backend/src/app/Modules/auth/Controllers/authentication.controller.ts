import { AuthenticateService, TokenPayload } from '../Services/authenticate.service';
import { Controller, Post, Res,Req, UseGuards, Logger } from '@nestjs/common';
import { Response,Request} from 'express';
import { LocalAuthGuard } from '../Services/local-strategy.service';
import { ExtractPayload } from '../extract-payload.decorator';
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
        })
        resp.cookie('isLogged', true,
        {
          expires:new Date(Date.now()+60*60*1000*24*7),
        })
        const return_data = {access_token:data_login.access_token,...data_login.user}
        return return_data;
    }
    @Post("refresh")
    async refreshToken(@Req() request: Request)
    {
        Logger.debug(request.cookies)
        return this.authService.refreshToken(request.cookies["refresh_token"]);
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) resp: Response)
    {
        resp.clearCookie("isLogged");
        resp.clearCookie("refresh_token");
    }


}
