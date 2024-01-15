import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user-service.service";
import { retry, tap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  urlsToNotUse:string[]

  constructor(private userService:UserService) {


    this.urlsToNotUse= [
      'auth/refresh',
    ];
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if(!this.isValidRequestForInterceptor(req.url))
    {
      return next.handle(req);
    }
    return next.handle(req).pipe(tap({
      error:(error:HttpErrorResponse)=>{
        if(error.status==HttpStatusCode.Unauthorized)
        {
          this.userService.refreshToken().subscribe();
          retry();
        }
      }
    }));
  }
  private isValidRequestForInterceptor(requestUrl: string): boolean {
    const positionIndicator: string = 'api/';
    const position = requestUrl.indexOf(positionIndicator);
    if (position > 0) {
      const destination: string = requestUrl.substr(position + positionIndicator.length);
      for (const address of this.urlsToNotUse) {
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    }
    return true;
  }
}
