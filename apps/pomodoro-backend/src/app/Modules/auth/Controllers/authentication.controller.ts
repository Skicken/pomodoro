import { AuthenticateService } from '../Services/authenticate.service';
import { Controller, Post, Res,Req, UseGuards } from '@nestjs/common';
import { Response,Request} from 'express';
import { LocalAuthGuard } from '../Services/local-strategy.service';
@Controller('auth')
export class AuthenticationController {

  constructor(private authService:AuthenticateService){}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req, @Res({ passthrough: true }) resp: Response)
  {

        const token = this.authService.login(req.user);
        resp.cookie('refresh_token', token.refresh_token,{
          httpOnly:true,
          expires:new Date(Date.now()+60*60*1000*24*7),

          //when and how cookies should be send
          //path:"refresh"
          //domain:""
          //secure: //only with https
        })
        resp.cookie('isLogged', true,
        {
          expires:new Date(Date.now()+60*60*1000*24*7),
        })
        // resp.status(HttpStatus.OK).send();
        const access_token = {access_token:token.access_token}
        return access_token;
    }
    @Post("refresh")
    async refreshToken(@Req() request: Request)
    {
        return this.authService.refreshToken(request.cookies["refresh_token"]);
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) resp: Response)
    {
        resp.clearCookie("isLogged");
        resp.clearCookie("refresh_token");
    }


}
