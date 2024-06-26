import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'



@Component({
  selector: 'pomodoro-add-template-dialog',
  templateUrl: './add-template-dialog.component.html',
  styleUrl: './add-template-dialog.component.css',
})
export class AddTemplateDialogComponent {
  form: FormGroup = new FormGroup({
    templateName: new FormControl(null, [Validators.required,Validators.minLength(5)])
  });
  constructor(public dialogRef: MatDialogRef<AddTemplateDialogComponent>)
  {
  }
  AddTemplate()
  {
    if(this.form.get("templateName")?.value && this.form.get("templateName")?.valid)
      this.dialogRef.close(this.form.get("templateName")?.value);
    else
    this.dialogRef.close();
  }

}
