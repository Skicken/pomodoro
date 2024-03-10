
import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private authService:AuthenticateService) {
    super();
  }
  async validate(login: string, password: string) {
    const user = await this.authService.validateUser({
      login:login, password:password}
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {



}

