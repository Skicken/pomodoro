import { AlarmService } from '../../../services/Alarm/alarm.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddTemplateDialogComponent } from '../AddTemplateDialog/add-template-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Alarm } from '../../../Model/alarm-model';
@Component({
  selector: 'pomodoro-alarm-add',
  templateUrl: './add-alarm-dialog.component.html',
  styleUrl: './add-alarm-dialog.component.css',
})
export class AddAlarmDialogComponent {

  whitelist = [
    'audio/wav',
    'audio/mpeg',
  ]
  file:File | null = null
  uploadingFile:boolean = false;
  invalidExtension:boolean = false;
  form: FormGroup = new FormGroup({
    alarmFile: new FormControl(null)
  });
  constructor(public dialogRef: MatDialogRef<AddTemplateDialogComponent>,private alarmService:AlarmService)
  {
  }
  AddAlarm()
  {
    if(!this.file) return;
    this.uploadingFile = true;
    this.alarmService.AddAlarm(this.file).subscribe({next:(alarm:Alarm)=>{
      this.uploadingFile = false;
      this.dialogRef.close(alarm)
    },
    error:(error:HttpErrorResponse)=>{
      this.dialogRef.close(error)
    }
  })
  }
  OnFileDropped(file:File)
  {
    let good = false;
    console.log(file.type)
    this.whitelist.forEach(element=>{
      if(file.type.includes(element) ) good = true
    })
    if(!good)
    {
      this.invalidExtension = true;
      return;
    }
    this.file = file
  }

}
