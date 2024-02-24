import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { SpotifyController } from './controllers/spotify.controller';

@Module({
  imports:[
    HttpModule,
    AuthModule
  ],
  controllers:[SpotifyController]

})
export class SpotifyModule {

}
