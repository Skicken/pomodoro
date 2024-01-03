import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user-service.service";
import { retry, tap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService:UserService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const authToken = this.userService.getAccessToken();


    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });

    return next.handle(authReq).pipe(tap({
      error:(error:HttpErrorResponse)=>{
        if(error.status==HttpStatusCode.Unauthorized)
        {
          this.userService.refreshToken();
          const authToken = this.userService.getAccessToken();
          authReq.headers.set('Authorization', authToken)
          retry();
        }
      }
    }));
  }
}
