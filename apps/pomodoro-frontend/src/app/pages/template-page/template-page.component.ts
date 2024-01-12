import { ListItem } from '../../components/SettingInput/SettingInput.component';
import { Component } from '@angular/core';
import { SetKeyTemplate, Setting, Template } from '../../Model/template-model';
import { exampleTemplate, exampleTemplate1 } from '../../Model/mock-template';
import { AddTemplateDialogComponent } from '../../components/AddTemplateDialog/add-template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';

import { ConfirmDialogComponent } from '../../components/ConfirmDialog/confirm-dialog.component';
@Component({
  selector: 'pomodoro-template-page',
  templateUrl: './template-page.component.html',
  styleUrl: './template-page.component.css',
})
export class TemplatePageComponent {
  selectedTemplate: Template = exampleTemplate;
  alarmItemList:ListItem[] = [];
  templates: Template[] = [exampleTemplate, exampleTemplate1];
  constructor(public dialog: MatDialog,private templateService:TemplateService)
  {
    const item:ListItem = {
      id: 1,
      displayName: 'Test'
    }
    this.alarmItemList = [item];
  }
  setValue(value: number) {
    console.log(value);
  }
  setKey(key: string, value: number) {
    //TODO: Exchange to service
    console.log('setting template key: ', key, 'to: ', value);
    SetKeyTemplate(key, value, this.selectedTemplate);
  }
  getKeyValue(key: string):number {
    const setting:Setting | undefined =  this.selectedTemplate.settings.find((element) => {
      return element.key == key;
    });
    if(setting) return setting.value;
    else
    {
      console.error("Could not find setting with: ",key)
      return 0;
    }
  }
  parseToHHMM(value: number): string {
    const h = Math.floor(value / 60);
    const m = value % 60;
    return (
      (h < 10 ? '0' : '') +
      h.toString() +
      ':' +
      (m < 10 ? '0' : '') +
      m.toString()
    );
  }
  openAddTemplate()
  {
    const dialogRef = this.dialog.open(AddTemplateDialogComponent)
    dialogRef.afterClosed().subscribe(name=>{
      this.templateService.AddTemplate({templateName:name});
    })

  }
  openDeleteTemplate()
  {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data:{message:"Are you sure you want to delete "+this.selectedTemplate.name+"?"}})
    dialogRef.afterClosed().subscribe(accept=>{
      if(accept)
      {
        console.log("confirmed choice")
        this.templateService.DeleteTemplate(this.selectedTemplate);
      }

    })
  }


}
