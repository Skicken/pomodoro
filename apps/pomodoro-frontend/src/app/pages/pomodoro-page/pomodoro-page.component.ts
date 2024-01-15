import { Component } from '@angular/core';
import { PomodoroService } from '../../services/pomodoro.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectTemplateDialogComponent } from '../../components/SelectTemplateDialog/select-template-dialog.component';
import { InfoService } from '../../services/info.service';

@Component({
  selector: 'pomodoro-pomodoro-page',
  templateUrl: './pomodoro-page.component.html',
  styleUrl: './pomodoro-page.component.css',
})
export class PomodoroPageComponent {
  constructor(readonly pomodoroService:PomodoroService,readonly infoService:InfoService,public dialog: MatDialog){

  }

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

