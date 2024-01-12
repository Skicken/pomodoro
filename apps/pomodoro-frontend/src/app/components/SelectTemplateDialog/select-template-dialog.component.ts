import { TemplateService } from './../../services/template.service';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Template } from '../../Model/template-model';

@Component({
  selector: 'pomodoro-select-template-dialog',
  templateUrl: './select-template-dialog.component.html',
  styleUrl: './select-template-dialog.component.css',
})
export class SelectTemplateDialogComponent {

    constructor(public dialogRef: MatDialogRef<SelectTemplateDialogComponent>,public templateService:TemplateService)
    {
    }
    SelectTemplate(template:Template)
    {
      this.dialogRef.close(template);
    }


}
