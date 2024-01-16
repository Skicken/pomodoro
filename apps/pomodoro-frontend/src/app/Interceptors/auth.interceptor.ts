import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpStatusCode, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, tap } from "rxjs";
import { AuthService } from "../modules/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) {

  }
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if(!this.authService.user)
    {
      return new Observable<HttpEvent<unknown>>
    }
    return next.handle(req).pipe(tap({
      error:(error:HttpErrorResponse)=>{
        if(error.status==HttpStatusCode.Unauthorized)
        {
          this.authService.refreshToken().subscribe({error:()=>{
            this.authService.logout();
          }});
          retry();
        }
      }
    }));
  }

}
