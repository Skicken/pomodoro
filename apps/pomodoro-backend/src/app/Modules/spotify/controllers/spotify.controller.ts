import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Response, Request } from 'express';
import { env } from 'process';
import axios from 'axios';
@Controller('spotify')
export class SpotifyController {
  redirectURI = 'http://localhost:3000/api/spotify/callback';
  constructor(private httpService: HttpService) {}

  @Get('callback')
  async Callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    if (state === null || code === null) {
      res.redirect(
        '/#' +
          {
            error: 'state_mismatch',
          }.toString()
      );
      throw new UnauthorizedException('User has not validated the application');
    }

    const form = {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectURI,
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      json: true,
    };
    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      form,
      {
        headers: headers,
      }
    );

    const tokenData = data;
    res.cookie('spotify_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
      path: 'api/spotify',
      domain: 'localhost',
      sameSite: 'strict',
    });
    res.cookie('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(tokenData.expires_in.toString()),
    });
  }
  @Get()
  IntegrateSpotify(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const state: string = randomBytes(16).toString('hex');
    const stringifiedParameters = new URLSearchParams({
      response_type: 'code',
      client_id: env.CLIENT_ID,
      redirect_uri: this.redirectURI,
      state: state,
    }).toString();

    return res.redirect(
      'https://accounts.spotify.com/authorize?' + stringifiedParameters
    );
  }
}
