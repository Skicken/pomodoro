import { SpotifyService } from './../../services/Spotify/spotify.service';
import { defaultAlarm } from './../../Model/alarm-model';
import { SnackBarService } from './../../services/Snackbar/snack-bar.service';
import { AlarmService } from './../../services/Alarm/alarm.service';
import { AuthService } from './../../modules/auth/auth.service';
import { Item } from '../../components/SettingInput/SettingInput.component';
import { Component, OnInit } from '@angular/core';
import { Setting, Template } from '../../Model/template-model';
import { AddTemplateDialogComponent } from '../../components/Dialogs/AddTemplateDialog/add-template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TemplateService } from '../../services/Template/template.service';

import { ConfirmDialogComponent } from '../../components/Dialogs/ConfirmDialog/confirm-dialog.component';
import {
  GetStorageTemplate,
  SetStorageTemplate,
} from '../../services/LocalStorage';
import { SelectTemplateDialogComponent } from '../../components/Dialogs/SelectTemplateDialog/select-template-dialog.component';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { defaultTemplate } from '../../Model/mock-template';
import { Router } from '@angular/router';

import { Alarm } from '../../Model/alarm-model';
import { AddAlarmDialogComponent } from '../../components/Dialogs/AddAlarmDialog/add-alarm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SpotifyPlaylistDialogComponent } from '../Dialogs/SpotifyPlaylistDialog/SpotifyPlaylistDialog.component';
import { SpotifyPlaylist } from '../../Model/spotify-playlist-model';
import { SettingKey } from '../../Model/template-model';
@Component({
  selector: 'pomodoro-template-settings',
  templateUrl: './TemplateSettings.component.html',
  styleUrl: './TemplateSettings.component.css',
})
export class TemplateSettingsComponent implements OnInit {

  selectedTemplate: Template = defaultTemplate;
  selectedTemplate$: BehaviorSubject<Template | null> =
    new BehaviorSubject<Template | null>(null);
  selectedAlarm: Alarm = defaultAlarm;
  alarmItemList$: BehaviorSubject<Item[] | null> = new BehaviorSubject<Item[] | null>(null);

  selectedPlaylist:SpotifyPlaylist | undefined = undefined;

  constructor(
    public dialog: MatDialog,
    public templateService: TemplateService,
    public alarmService: AlarmService,
    public authService: AuthService,
    private snackBarService: SnackBarService,
    private spotifyService:SpotifyService,
    public router: Router
  ) {}
  ngOnInit(): void {

    this.SetDefaultSelectedTemplate();
    this.SetDefaultSelectedAlarm();
    this.SetSpotifyPlaylist()
  }
  SetSpotifyPlaylist()
  {
    this.selectedTemplate$.subscribe((template:Template | null)=>{
    this.spotifyService.GetPlaylists().subscribe((playlists:SpotifyPlaylist[])=>{
      if(!template) return;
      const setting = template.GetKeyString(SettingKey.spotifyPlaylist);
      if(setting && setting.length>0)
        this.selectedPlaylist = playlists.find((element)=>{return element.uri===setting;})})
    })


  }
  SetDefaultSelectedAlarm() {
    this.alarmService.GetUserAlarms().subscribe((alarms: Alarm[]) => {
      const foundAlarm = alarms.find((element) => {
        return element.isDefault;
      });
      if (foundAlarm) {
        this.selectedAlarm = foundAlarm;
      }
    });
    this.SetAlarmDisplayItems();
  }
  SetSelectedAlarm(alarm: Alarm) {
    this.alarmService.GetUserAlarms().subscribe((alarms: Alarm[]) => {
      const foundAlarm = alarms.find((element) => {
        return element.id == alarm.id;
      });
      if (foundAlarm) {
        this.selectedAlarm = foundAlarm!;
      }
    });
  }
  SetDefaultSelectedTemplate() {
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
  GetBound(setting: Setting): Observable<Item | null> {
    return this.templateService.templates$.pipe(
      map((templates: Template[]) => {
        const foundTemplate = templates.find((element) => {
          return element.id == setting.ownerTemplateID;
        });
        if (foundTemplate && foundTemplate.id != this.selectedTemplate.id) {
          return <Item>{
            displayName: foundTemplate.templateName,
            id: foundTemplate.id,
          };
        }
        return null;
      })
    );
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
            this.SetDefaultSelectedTemplate();
          });
      }
    });
  }

  IntegrateSpotify()
  {
    this.spotifyService.AuthorizeSpotify()
    // this.spotifyService.IntegrateSpotify().subscribe({next:()=>{
    //   this.snackBarService.openInfoBar("Successfully integrated spotify account")
    // }});
  }
  SetSelectedTemplate(template: Template) {
    this.templateService
      .GetUserTemplates()
      .subscribe((templates: Template[]) => {
        const selectTemplate = templates.find((element) => {
          return template.id == element.id;
        });
        if (selectTemplate) {
          this.selectedTemplate = selectTemplate;
        }
      });
  }
  UpdateSetting(setting: Setting) {

    SetStorageTemplate(this.selectedTemplate);
    this.templateService.UpdateSetting(setting, setting.value).subscribe();
  }
  ParseToHHMM(value: number): string {
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
  OpenAddTemplateDialog() {
    const dialogRef = this.dialog.open(AddTemplateDialogComponent);
    dialogRef.afterClosed().subscribe((name) => {
      if (!name) return;
      this.templateService
        .AddTemplate({ templateName: name })
        .subscribe((template: Template) => {
          this.SetSelectedTemplate(template);
        });
    });
  }
  OpenDeleteTemplateDialog() {
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
        this.templateService
          .DeleteTemplate(this.selectedTemplate)
          ?.subscribe(() => {
            this.SetDefaultSelectedTemplate();
          });

      }
    });
  }
  OpenAddAlarmDialog() {
    const dialogRef = this.dialog.open(AddAlarmDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (value: Alarm | HttpErrorResponse) => {
        if(value instanceof HttpErrorResponse)
        {
          this.snackBarService.openErrorBar("Invalid data format");
        }
        else if(value) {
          this.SetSelectedAlarm(value)
          this.snackBarService.openInfoBar('Successfully added new alarm!');
        }
      }
    });
  }
  OpenSpotifyPlaylistDialog()
  {
    const dialogRef = this.dialog.open(SpotifyPlaylistDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (value: SpotifyPlaylist | null) => {
          if(value)
          {
              this.selectedTemplate.SetKey("spotifyPlaylist",value.uri)
              this.selectedPlaylist = value;
              this.UpdateSetting(this.selectedTemplate.GetKeySetting("spotifyPlaylist")!);
          }
      }
    });
  }
  SetAlarmDisplayItems() {
    return this.alarmService.alarms$.subscribe((alarms: Alarm[] | null) => {
      if (alarms) {
        this.alarmItemList$.next(alarms.map((element) => {

          return <Item>{ id: element.id, displayName: element.name };
        }));
      } else {
        this.alarmItemList$.next([])

      }
    });
  }

  OpenRemoveAlarmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Are you sure you want to delete ' + this.selectedAlarm.name + '?',
      },
    });
    dialogRef.afterClosed().subscribe((accept) => {
      if (accept) {
        this.alarmService.DeleteAlarm(this.selectedAlarm).subscribe(() => {
          this.SetDefaultSelectedAlarm();
          this.UpdateSelected();
        });
      }
    });
  }
  UpdateSelected() {
    SetStorageTemplate(this.selectedTemplate);
    this.SetSelectedTemplate(this.selectedTemplate)
  }

}
