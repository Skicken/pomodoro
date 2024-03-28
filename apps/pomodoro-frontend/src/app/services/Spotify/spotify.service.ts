import { SnackBarService } from './../Snackbar/snack-bar.service';
import { SpotifyPlaylist } from './../../Model/spotify-playlist-model';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  playlists$: BehaviorSubject<SpotifyPlaylist[] | null> = new BehaviorSubject<
    SpotifyPlaylist[] | null
  >(null);
  constructor(private http: HttpClient,
    private snackBarService:SnackBarService, private router:Router ) {

    // this.RefreshToken().subscribe();
  }
  AuthorizeSpotify(returnURL: string = '') {
    if (returnURL.length <= 0) returnURL = this.router.url;
    window.location.href = 'http://localhost:3000/api/spotify/';
  }
  GetPlaylists() {
    return this.http.get<{ items: SpotifyPlaylist[] }>('api/spotify/playlist', {}).pipe(
      map((data: { items: SpotifyPlaylist[] }) => {
        this.playlists$.next(data.items)
        return data.items;
      })
    );
  }
  RefreshToken() {
    return this.http.post('api/spotify/refresh', {});
  }

  ContinuePlaying() {
    return this.http.put('api/spotify/play', {});
  }
  PausePlaying() {
    return this.http.put('api/spotify/pause', {});
  }

  PlayPlaylist(playlist_uri: string) {
    return this.http.put('api/spotify/play', { context_uri: playlist_uri });
  }
}
