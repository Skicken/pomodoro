import { CanActivate, ExecutionContext, Injectable, Logger, Query, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { isNumber } from 'class-validator';
import { Observable } from 'rxjs';


export const RESOURCE_OWNER_KEY = 'resource_owner';
export const ResourceOwner = (userID: number) => SetMetadata(RESOURCE_OWNER_KEY, userID);

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private reflector:Reflector){}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {

      const request = context.switchToHttp().getRequest();
      const params = request.query;
      let userID = params.userID;
      const userIDdec = this.reflector.getAllAndOverride<number>(RESOURCE_OWNER_KEY, [
        context.getHandler(),
      ]);

      if(!userID) userID = userIDdec;
      if(!userID) return false;

      //Getting user from jwt token
      const user = context.switchToHttp().getRequest().user

      if(!user) return false;
      return user.sub == userID || user.role==UserType.ADMIN;
  }
}
