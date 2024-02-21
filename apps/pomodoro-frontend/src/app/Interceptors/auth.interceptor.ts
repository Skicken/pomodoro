import { SnackBarService } from '../services/Snackbar/snack-bar.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { retry, tap } from "rxjs";
import { AuthService } from "../modules/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private info:SnackBarService) {

  }
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
     if(!this.authService.user)
     {
       console.log("not using tokens!")
       return next.handle(req);
     }
    return next.handle(req).pipe(tap({
      error:(error:HttpErrorResponse)=>{
        if(error.status==HttpStatusCode.Unauthorized)
        {
          this.authService.refreshToken().subscribe()
          retry();
        }
        if(error.status==HttpStatusCode.InternalServerError)
        {
          this.info.openInfoBar("Internal Server Error!");
        }
      }
    }));
  }

}
