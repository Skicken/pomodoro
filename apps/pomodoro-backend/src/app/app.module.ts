import { Module } from '@nestjs/common';

import { PomodoroModule } from './Modules/pomodoro/pomodoro.module';
import { PrismaModule } from './Modules/prisma/prisma.module';
import { AuthModule } from './Modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './Modules/spotify/spotify.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PomodoroModule,
    PrismaModule,
    AuthModule,
    SpotifyModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
