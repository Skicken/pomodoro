import { Component } from '@angular/core';
import { SpotifyService } from '../../../services/Spotify/spotify.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SpotifyPlaylist } from '../../../Model/spotify-playlist-model';

@Component({
  selector: 'pomodoro-spotify-playlist-dialog',
  templateUrl: './SpotifyPlaylistDialog.component.html',
  styleUrl: './SpotifyPlaylistDialog.component.css',
})
export class SpotifyPlaylistDialogComponent {

    constructor(public dialogRef: MatDialogRef<SpotifyPlaylistDialogComponent>,public spotifyService:SpotifyService)
    {
      spotifyService.GetPlaylists().subscribe({error:(error)=>{
        dialogRef.close()
      }})
    }
    SelectPlaylist(playlist:SpotifyPlaylist)
    {
      this.dialogRef.close(playlist)

    }
}
