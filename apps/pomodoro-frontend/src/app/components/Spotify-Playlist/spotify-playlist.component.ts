import { Component, Input } from '@angular/core';
import { SpotifyPlaylist } from '../../Model/spotify-playlist-model';

@Component({
  selector: 'pomodoro-spotify-playlist',
  templateUrl: './spotify-playlist.component.html',
  styleUrl: './spotify-playlist.component.css',
})
export class SpotifyPlaylistComponent {


  @Input({required:true})
  playlist:SpotifyPlaylist | null = null
  constructor()
  {
  }
}
