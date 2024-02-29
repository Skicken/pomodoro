import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'pomodoro-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.css',
})
export class ErrorPopupComponent {

  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
