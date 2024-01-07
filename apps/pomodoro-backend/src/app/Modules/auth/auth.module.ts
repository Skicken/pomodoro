import { Module } from '@nestjs/common';
import { AuthenticateService } from './Services/authenticate.service';
import { AuthenticationController } from './Controllers/authentication.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Services/local-strategy.service';
import { JwtStrategy } from './Services/jwt-strategy.service';
import { env } from 'process';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("ACCESS_SECRET"),
          signOptions: { expiresIn: '3600s' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthenticateService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticateService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
