import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoPopupComponent } from '../components/InfoPopup/info-popup.component';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

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
}
