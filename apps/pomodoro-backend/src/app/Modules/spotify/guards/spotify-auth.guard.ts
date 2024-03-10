import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class SpotifyAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request:Request = context.switchToHttp().getRequest();
    if(!request.cookies['spotify_access_token'] || !request.cookies['spotify_refresh_token'])
    {
      throw new UnauthorizedException();
    }
    return true;

  }
}
