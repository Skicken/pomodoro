import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


interface ConfirmMessage
{
  message:string;
}
@Component({
  selector: 'pomodoro-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmMessage,
  ) {

  }
  Yes()
  {
    this.dialogRef.close(true);
  }
  No()
  {
    this.dialogRef.close(false);
  }
}
