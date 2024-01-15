import { ListItem } from '../../components/SettingInput/SettingInput.component';
import { Component } from '@angular/core';
import { Setting, Template } from '../../Model/template-model';
import { AddTemplateDialogComponent } from '../../components/AddTemplateDialog/add-template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';

import { ConfirmDialogComponent } from '../../components/ConfirmDialog/confirm-dialog.component';
import { InfoService } from '../../services/info.service';
@Component({
  selector: 'pomodoro-template-page',
  templateUrl: './template-page.component.html',
  styleUrl: './template-page.component.css',
})
export class TemplatePageComponent {
  selectedTemplate: Template;
  alarmItemList:ListItem[] = [];
  constructor(public dialog: MatDialog,public templateService:TemplateService,private infoService:InfoService)
  {


    this.selectedTemplate = templateService.templates[0];
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
    const setting:Setting = this.selectedTemplate.GetKeySetting(key)!;
    this.selectedTemplate = this.templateService.UpdateSetting(this.selectedTemplate,setting,value)
    console.log('setting template key: ', key, 'to: ', value);

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
    if(this.selectedTemplate.isDefault)
    {
      this.infoService.openInfoBar("Cannot delete default template");
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data:{message:"Are you sure you want to delete "+this.selectedTemplate.templateName+"?"}})
    dialogRef.afterClosed().subscribe(accept=>{
      if(accept)
      {
        console.log("confirmed choice")
        this.templateService.DeleteTemplate(this.selectedTemplate);
      }

    })
  }


}
