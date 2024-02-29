import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoPopupComponent } from '../../components/Popups/InfoPopup/info-popup.component';
import { ErrorPopupComponent } from '../../components/Popups/ErrorPopup/error-popup.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {
  }

  openInfoBar(message:string,duration:number=5) {
    this.snackBar.openFromComponent(InfoPopupComponent, {
      duration: duration * 1000,
      data:message,
      horizontalPosition:"right",
      verticalPosition: "bottom",
    });
  }
  openErrorBar(message:string,duration:number=5)
  {
    this.snackBar.openFromComponent(ErrorPopupComponent, {
      duration: duration * 1000,
      data:message,
      horizontalPosition:"right",
      verticalPosition: "bottom",
    });
  }



}
