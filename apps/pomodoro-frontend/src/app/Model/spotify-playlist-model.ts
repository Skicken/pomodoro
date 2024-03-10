export interface SpotifyPlaylist
{
  name:string,
  type:string,
  uri: string,
  owner:{display_name:string},
  id:string,
  images:{
    height:number,
    width:number,
    url:string,
  }[]
}
