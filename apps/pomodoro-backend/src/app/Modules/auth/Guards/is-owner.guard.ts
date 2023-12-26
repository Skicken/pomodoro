import { CanActivate, ExecutionContext, Injectable, Logger, Query } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { Observable } from 'rxjs';



@Injectable()
export class IsOwnerGuard implements CanActivate {

  constructor(private reflector:Reflector){}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {

      const request = context.switchToHttp().getRequest();
      const params = request.query;
      const userID = params.userID;


      if(!userID) return false;


      //Getting user from jwt token
      const user = context.switchToHttp().getRequest().user
      if(!user) return false;
      return user.sub == userID || user.role==UserType.ADMIN;
  }
}
