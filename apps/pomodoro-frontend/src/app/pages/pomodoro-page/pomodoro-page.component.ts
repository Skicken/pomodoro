

import { Component, OnInit } from '@angular/core';
import { PomodoroService } from '../../services/Pomodoro/pomodoro.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectTemplateDialogComponent } from '../../components/SelectTemplateDialog/select-template-dialog.component';
import { SnackBarService } from '../../services/Snackbar/snack-bar.service';
import { GetStorageTemplate, GetStorageUser } from '../../services/LocalStorage';
import { TemplateService } from '../../services/Template/template.service';
import { Template } from '../../Model/template-model';
import { AlarmService } from '../../services/Alarm/alarm.service';

@Component({
  selector: 'pomodoro-pomodoro-page',
  templateUrl: './pomodoro-page.component.html',
  styleUrl: './pomodoro-page.component.css',
})
export class PomodoroPageComponent implements OnInit{

  constructor(readonly pomodoroService:PomodoroService,private templateService:TemplateService,
    readonly infoService:SnackBarService,public dialog: MatDialog,private alarmService:AlarmService){

  }
  ngOnInit(): void {
    this.SetSelected();
  }

  SetSelected()
  {
    this.templateService.GetUserTemplates().subscribe((templates:Template[])=>{
      const defaultTemplate = templates.find((element)=>{return element.isDefault});
      const storageTemplate:Template | undefined = GetStorageTemplate()
      let hasSet = false;
      if(storageTemplate)
      {
        const foundTemplate:Template | undefined = templates.find((element)=>{return element.id== storageTemplate.id});
        if(foundTemplate)
        {
          this.pomodoroService.SetTemplate(foundTemplate);
          hasSet = true;
        }
      }
      if(defaultTemplate && !hasSet)
      {
        this.pomodoroService.SetTemplate(defaultTemplate);
      }
    })}
  formatTimer(value:number):string
  {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
  openTemplateSelection()
  {
    const dialogRef = this.dialog.open(SelectTemplateDialogComponent)
    dialogRef.afterClosed().subscribe(selectedTemplate=>{
      if(selectedTemplate)
      {
        console.log("selecting template");
        this.pomodoroService.SetTemplate(selectedTemplate);
      }
    })
  }


}

