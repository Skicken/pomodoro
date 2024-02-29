import { Module } from '@nestjs/common';

import { PomodoroModule } from './Modules/pomodoro/pomodoro.module';
import { PrismaModule } from './Modules/prisma/prisma.module';
import { AuthModule } from './Modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PomodoroModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
