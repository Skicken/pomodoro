import { AuthService } from './../../modules/auth/auth.service';
import { Item } from '../../components/SettingInput/SettingInput.component';
import { Component, OnInit } from '@angular/core';
import { Setting, Template } from '../../Model/template-model';
import { AddTemplateDialogComponent } from '../../components/AddTemplateDialog/add-template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';

import { ConfirmDialogComponent } from '../../components/ConfirmDialog/confirm-dialog.component';
import {
  GetStorageTemplate,
  SetStorageTemplate,
} from '../../services/helper';
import { SelectTemplateDialogComponent } from '../../components/SelectTemplateDialog/select-template-dialog.component';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { exampleTemplate } from '../../Model/mock-template';
import { Router } from '@angular/router';
@Component({
  selector: 'pomodoro-template-page',
  templateUrl: './template-page.component.html',
  styleUrl: './template-page.component.css',
})
export class TemplatePageComponent implements OnInit {
  selectedTemplate: Template = exampleTemplate ;
  selectedTemplate$: BehaviorSubject<Template | null> = new BehaviorSubject<Template | null>(null);

  alarmItemList: Item[] = [];
  constructor(
    public dialog: MatDialog,
    public templateService: TemplateService,
    public authService: AuthService,
    public router:Router
  ) {
    this.SetDefaultSelected();
    const item: Item = {
      id: 1,
      displayName: 'Test',
    };
    this.alarmItemList = [item];
  }
  ngOnInit(): void {
    this.SetDefaultSelected();
  }

  SetDefaultSelected() {
    this.templateService
      .GetUserTemplates()
      .subscribe((templates: Template[]) => {
        const defaultTemplate = templates.find((element) => {
          return element.isDefault;
        });
        const storageTemplate: Template | undefined = GetStorageTemplate();
        let hasSet = false;

        if (storageTemplate) {
          const foundTemplate: Template | undefined = templates.find(
            (element) => {
              return element.id == storageTemplate.id;
            }
          );
          if (foundTemplate) {
            this.selectedTemplate = foundTemplate;
            hasSet = true;
          }

        }
        if (defaultTemplate && !hasSet) {
          this.selectedTemplate = defaultTemplate;
        }
        this.selectedTemplate$.next(this.selectedTemplate);

      });
  }
  GetBound(setting:Setting):Observable<Item|null> {
    return this.templateService.templates$.pipe(map((templates: Template[]) => {
      const foundTemplate = templates.find((element) => {
        return element.id == setting.ownerTemplateID;
      });
      if (foundTemplate && foundTemplate.id!=this.selectedTemplate.id) {
        return  <Item>{
          displayName: foundTemplate.templateName,
          id: foundTemplate.id,
        };
      }
      return null;
    }));
  }
  SetBinding(setting: Setting) {
    const dialogRef = this.dialog.open(SelectTemplateDialogComponent);
    dialogRef.afterClosed().subscribe((dialogTemplate: Template) => {
      if (dialogTemplate) {
        let dialogSetting: Setting | undefined = dialogTemplate.settings.find(
          (element) => {
            return element.settingNameID == setting.settingNameID;
          }
        );
        if (dialogTemplate.id == this.selectedTemplate.id) {
          dialogSetting = undefined;
        }
        this.templateService
          .Bind(this.selectedTemplate, setting, dialogSetting)
          ?.subscribe(() => {
            this.SetDefaultSelected();

          });
      }
    });
  }
  SetSelected(template: Template) {
    this.templateService.GetUserTemplates().subscribe((templates: Template[]) => {
      const selectTemplate = templates.find((element) => {
        return template.id == element.id;
      });
      if (selectTemplate) {
        this.selectedTemplate = selectTemplate;
      }
    });
  }
  UpdateSetting(setting: Setting) {
    console.log(this.selectedTemplate);

    SetStorageTemplate(this.selectedTemplate);
    this.templateService.UpdateSetting(setting, setting.value).subscribe(() => {
      this.SetDefaultSelected();
    });
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
      if (!name) return;
      this.templateService
        .AddTemplate({ templateName: name })
        .subscribe((template: Template) => {
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
        this.templateService
          .DeleteTemplate(this.selectedTemplate)
          ?.subscribe(() => {
            this.SetDefaultSelected();
          });
      }
    });
  }
  UpdateSelected() {
    SetStorageTemplate(this.selectedTemplate);
  }
}
