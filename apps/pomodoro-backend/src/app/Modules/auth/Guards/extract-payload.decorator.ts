import { ExecutionContext, ForbiddenException, InternalServerErrorException, createParamDecorator } from '@nestjs/common';
import { TokenPayload } from '../Services/authenticate.service';
import { UserType } from '@prisma/client';


export const isOwner=(userID:number,payload:TokenPayload)=>
{
  return userID==payload.sub || payload.role == UserType.ADMIN;
}
export const isOwnerIgnore=(userID:number,payload:TokenPayload)=>
{
  return userID==payload.sub;
}
export const checkOwnerThrow = (userID:number,payload:TokenPayload)=>
{
  if(!isOwner(userID,payload)) throw new ForbiddenException();
}
export const checkOwnerThrowIgnoreAdmin = (userID:number,payload:TokenPayload)=>
{
  if(!isOwnerIgnore(userID,payload)) throw new ForbiddenException();
}
export const CheckPayloadOwner = createParamDecorator(
  (userID: number, ctx: ExecutionContext) : TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    const payload:TokenPayload = request.user;
    checkOwnerThrow(userID,payload);
    return payload;
  },)
export const ExtractPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) : TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    if(!request.user) throw new InternalServerErrorException("JWT should be used on path")
    return request.user;
  },
);
