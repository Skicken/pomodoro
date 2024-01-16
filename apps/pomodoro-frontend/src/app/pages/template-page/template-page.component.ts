import { AuthService } from './../../modules/auth/auth.service';
import { Item } from '../../components/SettingInput/SettingInput.component';
import { Component, OnInit } from '@angular/core';
import { Setting, Template } from '../../Model/template-model';
import { AddTemplateDialogComponent } from '../../components/AddTemplateDialog/add-template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';

import { ConfirmDialogComponent } from '../../components/ConfirmDialog/confirm-dialog.component';
import { InfoService } from '../../services/info.service';
import { GetStorageTemplate, GetStorageUser, SetStorageTemplate } from '../../services/helper';
import { exampleTemplate } from '../../Model/mock-template';
@Component({
  selector: 'pomodoro-template-page',
  templateUrl: './template-page.component.html',
  styleUrl: './template-page.component.css',
})
export class TemplatePageComponent implements OnInit {
  selectedTemplate: Template = exampleTemplate;
  alarmItemList: Item[] = [];
  constructor(
    public dialog: MatDialog,
    public templateService: TemplateService,
    public authService:AuthService
  ) {
    const item: Item = {
      id: 1,
      displayName: 'Test',
    };
    this.alarmItemList = [item];
  }
  ngOnInit(): void {
    if (!GetStorageUser())
    {
      this.selectedTemplate = this.templateService.templates[0];
    }
    else {
      this.SetDefaultSelected()
    }
  }

  SetDefaultSelected()
  {
    this.templateService.GetUserTemplates().subscribe((templates: Template[]) => {
      const defaultTemplate = this.templateService.templates.find((element)=>{return element.isDefault});
      const storageTemplate:Template | undefined = GetStorageTemplate()
      let hasSet = false;
      if(storageTemplate)
      {
        const foundTemplate:Template | undefined = templates.find((element)=>{return element.id== storageTemplate.id});
        if (foundTemplate) {
          this.selectedTemplate = foundTemplate;
          hasSet = true
        }
      }
      if (defaultTemplate && !hasSet) {
        this.selectedTemplate = defaultTemplate;
      }
    });
  }
  SettingBoundItem(key:string)
  {
    let item:Item | undefined = undefined
    const foundSetting = this.selectedTemplate.GetKeySetting(key)
    if(foundSetting && foundSetting?.ownerTemplateID!=this.selectedTemplate.id)
    {
      return this.templateService.templates$.subscribe((templates:Template[])=>{
        const foundTemplate = templates.find((element)=>{return element.id == foundSetting.ownerTemplateID})

        if(foundTemplate)
        {
          item = <Item>{displayName:foundTemplate.templateName,id:foundTemplate.id}
          return item
        }
      })
    }

    return  item;
  }

  SetSelected(template:Template)
  {
    this.templateService.GetUserTemplates().subscribe((templates: Template[]) => {
      const selectTemplate = templates.find((element) => {
        return template.id==element.id;
      });
      if (selectTemplate) {
        this.selectedTemplate = selectTemplate;
      }
    });
  }
  UpdateSetting(key: string, value: number) {
    const setting: Setting = this.selectedTemplate.GetKeySetting(key)!;
    this.selectedTemplate.SetKey(key,value);
    SetStorageTemplate(this.selectedTemplate);
    localStorage.setItem("selectedTemplate",JSON.stringify(this.selectedTemplate));
    this.templateService.UpdateSetting(
      setting,
      value
    ).subscribe();
    console.log('setting template key: ', key, 'to: ', value);
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
  openAddTemplate() {
    const dialogRef = this.dialog.open(AddTemplateDialogComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if(!name) return;
      this.templateService.AddTemplate({ templateName: name }).subscribe((template:Template)=>
      {
          this.SetSelected(template);
      });
    });
  }
  openDeleteTemplate() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Are you sure you want to delete ' +
          this.selectedTemplate.templateName +
          '?',
      },
    });
    dialogRef.afterClosed().subscribe((accept) => {
      if (accept) {
        console.log('confirmed choice');
        this.templateService.DeleteTemplate(this.selectedTemplate)?.subscribe(()=>{
        this.SetDefaultSelected();
        })
      }
    });
  }
  UpdateSelected()
  {
    SetStorageTemplate(this.selectedTemplate);
  }
}
