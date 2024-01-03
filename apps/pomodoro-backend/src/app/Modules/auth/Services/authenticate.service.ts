import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../DTO/login-dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ReturnUserDTO } from '../../pomodoro/Dto/user-dto';
import { User, UserType } from '@prisma/client';
import { env } from 'process';

export class TokenPayload
{
  sub:number
  role:UserType
}

@Injectable()
export class AuthenticateService {

  constructor(private prisma:PrismaService, private jwtService: JwtService){}

  async refreshToken(refresh_token: string) {

    if(!refresh_token) throw new UnauthorizedException()

    const payload:TokenPayload = this.jwtService.verify(refresh_token,{secret:env.REFRESH_SECRET});
    Logger.debug(payload)
    if(!payload) throw new UnauthorizedException()
    const accessPayload:TokenPayload = {sub: payload.sub, role: payload.role}
    const user = await this.prisma.user.findUnique({
      where: {
        id:payload.sub
      }
    });
    return {
      access_token:this.jwtService.sign(accessPayload),
      ...plainToInstance(ReturnUserDTO,user),
    }
  }



  login(user: User) {
    const payload:TokenPayload = { sub: user.id, role: user.userType};
    return {
      user:plainToInstance(ReturnUserDTO,user),
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
