import { PrismaService } from './../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { Request, Response } from 'express';

@Injectable()
export class SpotifyService {
  constructor(private prisma: PrismaService) {}
  AccessHeaders(req: Request) {
    const headers = {
      Authorization: 'Bearer ' + req.cookies['spotify_access_token'],
    };
    return headers;
  }
  SetAuthorizationCookies(res: Response, tokenData) {
    if (tokenData.refresh_token)
      res.cookie('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
      });
    if (tokenData.access_token)
      res.cookie('spotify_access_token', tokenData.access_token, {
        httpOnly: true,
        expires: new Date(tokenData.expires_in.toString()),
      });
  }
  SetUser(res: Response, user) {
    res.cookie('spotify_user', user, {
      httpOnly: true,
      path: 'api/spotify',
      domain: 'localhost',
      sameSite: 'strict',
    });
  }
  async SpotifyAuthorizedGet(url: string, headers) {
    return await axios
      .get(url, {
        headers: headers,
      })
      .catch((error: HttpErrorResponse) => {
        throw new BadRequestException(error.message);
      })
      .catch((error: UnauthorizedException) => {
        throw new UnauthorizedException(error.message);
      })
      .catch((error: ForbiddenException) => {
        throw new ForbiddenException(error.message);
      });
  }
  async SpotifyAuthorizedPut(url: string, data, headers) {
    return await axios
      .put(url, data, { headers: headers })
      .catch((error: BadRequestException) => {
        throw new BadRequestException(error.message);
      })
      .catch((error: UnauthorizedException) => {
        throw new UnauthorizedException(error.message);
      })
      .catch((error: ForbiddenException) => {
      })
      .then(() => {});
  }
  async SpotifyAuthorizedPost(url: string, data, headers) {
    return await axios
      .put(url, data, { headers: headers })
      .catch((error: BadRequestException) => {
        throw new BadRequestException(error.message);
      })
      .catch((error: UnauthorizedException) => {
        throw new UnauthorizedException(error.message);
      })
      .catch((error: ForbiddenException) => {
        throw new ForbiddenException(error.message);
      })
      .then(() => {});
  }
  async SetSpotifyIntegration(userID, value: boolean) {
    Logger.debug("Updating user integration " + value)
    return await this.prisma.user.update({
      where: { id: userID },
      data: {
        spotifyIntegrated: value,
      },
    });
  }
}
