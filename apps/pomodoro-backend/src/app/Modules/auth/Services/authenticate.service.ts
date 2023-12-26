import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../DTO/login-dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ReturnUserDTO } from '../../pomodoro/Dto/user-dto';
import { User, UserType } from '@prisma/client';
import { env } from 'process';
@Injectable()
export class AuthenticateService {
  refreshToken(refresh_token: string) {

    if(!refresh_token) return new UnauthorizedException()
    const payload = this.jwtService.verify(refresh_token,{secret:env.REFRESH_SECRET});
    if(!payload) return new UnauthorizedException()

    const accessPayload = {sub: payload.sub, role: payload.userType}
    return {
      access_token:this.jwtService.sign(accessPayload),
    }
  }


  constructor(private prisma:PrismaService, private jwtService: JwtService){}

  login(user: User) {
    const payload = { sub: user.id, role: user.userType};
    return {
      access_token:this.jwtService.sign(payload),
      refresh_token:this.jwtService.sign(payload,{
        secret:env.REFRESH_SECRET,
        expiresIn:"7d"
      })
    }
  }
  async validateUser(dto: LoginDto) {

    const user = await this.prisma.user.findUnique({
        where: {
          email:dto.login
      }
    });
    if(user && bcrypt.compareSync(dto.password,user.password))
    {
      return plainToInstance(ReturnUserDTO,user);
    }
    return null;

  }


}
