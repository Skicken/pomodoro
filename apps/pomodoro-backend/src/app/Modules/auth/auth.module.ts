import { Module } from '@nestjs/common';
import { AuthenticateService } from './Services/authenticate.service';
import { AuthenticationController } from './Controllers/authentication.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Services/local-strategy.service';
import { JwtStrategy } from './Services/jwt-strategy.service';


@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: env.ACCESS_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthenticateService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticateService],
})
export class AuthModule {}
