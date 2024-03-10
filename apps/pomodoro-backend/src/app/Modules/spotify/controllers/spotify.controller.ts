import { HttpErrorResponse } from '@angular/common/http';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Response, Request } from 'express';
import { env } from 'process';
import axios from 'axios';
import { SpotifyService } from '../services/spotify.service';
import { SpotifyAuthGuard } from '../guards/spotify-auth.guard';
import { PlaySpotifyDTO } from '../DTO/play-spotify-dto';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { ExtractJwt } from 'passport-jwt';
import { ExtractPayload } from '../../auth/Guards/extract-payload.decorator';
import { TokenPayload } from '../../auth/Services/authenticate.service';
@Controller('spotify')

@UseGuards(JwtAuthGuard)
export class SpotifyController {
  redirectURI = 'http://localhost:3000/api/spotify/callback';
  redirectServer = 'http://localhost:4200/spotify-status'
  scope =
    'playlist-read-private ' +
    'app-remote-control ' +
    'user-modify-playback-state ' +
    'user-read-playback-state';

  constructor(private spotifyService: SpotifyService) {}

  @Get('callback')
  async Callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @ExtractPayload() token:TokenPayload
  ) {
    const stringifiedParameters = new URLSearchParams()

    const code = req.query.code || null;
    const state = req.query.state || null;
    if (state === null || code === null) {
      stringifiedParameters.set("statusMessage","Unsuccessful spotify authorization")
      stringifiedParameters.set("status","400")
      res.redirect(
        this.redirectServer+"?"+stringifiedParameters
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
    const url = 'https://accounts.spotify.com/api/token';
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const tokenResponse = await axios
      .post(url, form, {
        headers: headers,
      })
      .then((data) => {
        return data;
      })
      .catch((error: HttpErrorResponse) => {
        throw new BadRequestException(error.message);
      });

    this.spotifyService.SetAuthorizationCookies(res, tokenResponse.data);
    this.spotifyService.SetSpotifyIntegration(token.sub,true)
    stringifiedParameters.set("statusMessage","Successful spotify authorization")
    stringifiedParameters.set("status","200")
    res.redirect(
      this.redirectServer+"?"+stringifiedParameters
    );
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
      scope: this.scope,
    }).toString();
    return res.redirect(
      'https://accounts.spotify.com/authorize?' + stringifiedParameters
    );
  }
  @UseGuards(SpotifyAuthGuard)
  @Get('user')
  async GetUserInfo(@Req() req: Request) {
    const headers = this.spotifyService.AccessHeaders(req);
    const url = 'https://api.spotify.com/v1/me';
    return (await this.spotifyService.SpotifyAuthorizedGet(url, headers)).data;
  }
  @UseGuards(SpotifyAuthGuard)
  @Get('playlist')
  async GetPlaylists(@Req() req: Request) {
    const headers = this.spotifyService.AccessHeaders(req);
    const url = 'https://api.spotify.com/v1/me/playlists';
    return (await this.spotifyService.SpotifyAuthorizedGet(url, headers)).data;
  }

  @UseGuards(SpotifyAuthGuard)
  @Put('pause')
  PauseSpotify(@Req() req: Request) {
    const headers = this.spotifyService.AccessHeaders(req);
    const url = "https://api.spotify.com/v1/me/player/pause";
    return this.spotifyService.SpotifyAuthorizedPut(url,{},headers)
  }

  @UseGuards(SpotifyAuthGuard)
  @Put('play')
  PlaySpotify(@Body() dto: PlaySpotifyDTO,@Req() req: Request, ) {

    const headers = this.spotifyService.AccessHeaders(req);
    const url = "https://api.spotify.com/v1/me/player/play";
    return this.spotifyService.SpotifyAuthorizedPut(url,dto,headers)

  }
  @Post('refresh')
  @UseGuards(SpotifyAuthGuard)
  async RefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = 'https://accounts.spotify.com/api/token';
    const form = {
      grant_type: 'refresh_token',
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      refresh_token: req.cookies['spotify_refresh_token'],
      json: true,
    };
    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    const { data } = await axios
      .post(url, form, { headers: headers })
      .then((data) => {
        return data;
      })
      .catch((error: HttpErrorResponse) => {
        throw new BadRequestException(error.message);
      });
    Logger.debug(data);
    this.spotifyService.SetAuthorizationCookies(res, data);
  }
}
