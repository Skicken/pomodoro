import { SpotifyService } from './../services/Spotify/spotify.service';

import { SnackBarService } from '../services/Snackbar/snack-bar.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, catchError, retry, tap } from 'rxjs';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private info: SnackBarService
  ) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.authService.user) {
      return EMPTY;
    }

    if (req.url.startsWith("api/spotify")) {
      return this.HandleSpotify(req, next);
    } else {
      return this.HandleAuth(req, next);
    }
  }
  HandleAuth(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status == HttpStatusCode.InternalServerError) {
            this.info.openInfoBar('Internal Server Error!');
          }
          if (error.status == HttpStatusCode.Unauthorized && !req.url.startsWith('api/auth/refresh')) {
            this.authService.RefreshToken().subscribe();
            retry();
          }
        },
      }),
      tap({
        error: (error) => {
          this.authService.Logout();
        },
      })
    );
  }
  HandleSpotify(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status == HttpStatusCode.InternalServerError) {
            this.info.openInfoBar('Internal Server Error!');
          }
          if (
            error.status == HttpStatusCode.Unauthorized && this.authService.user?.spotifyIntegrated && !req.url.startsWith("api/spotify/refresh")
          ) {
            this.spotifyService.AuthorizeSpotify()
            this.spotifyService.RefreshToken().subscribe();
          }
          if(error.status == HttpStatusCode.Forbidden)
          {
          }
        },
      }),
      tap({
        error: () => {
        },
      })
    );
  }
}
