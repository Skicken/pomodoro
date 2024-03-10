import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import { Observable } from 'rxjs';



export const ROLES_KEY = 'role';
export const Role = (role: UserType) => SetMetadata(ROLES_KEY, role);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector:Reflector){

  }
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {

    const role = this.reflector.getAllAndOverride<UserType>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if(!role) true;

    const user = context.switchToHttp().getRequest().user
    if(!user) return false;
    if(role==UserType.ADMIN)
      return user.role == role;
    else return user.role == role || user.role==UserType.ADMIN;
  }
}
