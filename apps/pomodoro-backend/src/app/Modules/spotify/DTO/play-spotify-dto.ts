import { IsOptional } from "class-validator";

export class PlaySpotifyDTO
{
  //albums, artists & playlists spotify uris.
  @IsOptional()
  context_uri:string
}
