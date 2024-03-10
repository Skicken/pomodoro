import { SettingType } from "@prisma/client";

export interface Setting {
  id: number;
  settingNameID: number;
  key: string;
  value: number | string;
  ownerTemplateID:number;
  usedByTemplates:Template[]
  type:SettingType
}
export class Template {
  SetKey(key: string, value: number | string) {
    const setting = this.settings.find((element) => {
      return element.key == key;
    });
    if (setting)
    {
      setting.value = value;
    }
    else console.error('Could not find setting with: ', key);
  }
  id: number = 0;
  settings: Setting[] = [];
  isDefault: boolean = false;
  templateName: string = '';

  GetKeySetting(key: string): Setting | undefined {

    const setting:Setting | undefined =  this.settings.find((element) => {
      return element.key=== key;
    });
    if (setting)
    {
      return setting;
    }
    console.log(this.settings)
    console.error('Could not find setting with: ', key);
    return undefined;
  }
  GetKey(key: string): number {
    return <number>this.GetKeySetting(key)!.value;
  }
  GetKeyString(key: string): string {
    return <string>this.GetKeySetting(key)!.value;
  }
  public constructor(init?: Partial<Template>) {
    Object.assign(this, init);
  }
}

export enum SettingKey
{
  shortBreakKey = 'shortBreak',
  pomodoroKey = 'pomodoro',
  longBreakKey = 'longBreak',
  sessionsBeforeLongBreakKey = "sessionBeforeLongBreak",
  pomodoroAutostartKey = 'pomodoroAutostart',
  breakAutostartKey = 'breakAutostart',
  pomodoroAlert = 'pomodoroAlert',
  pomodoroAlertVolumeKey = 'pomodoroAlertVolume',
  breakAlertKey = 'breakAlert',
  breakAlertVolumeKey = 'breakAlertVolume',
  backgroundColorKey = 'backgroundColor' ,
  spotifyPlaylist = 'spotifyPlaylist',
  playOnBreak = 'playOnBreak'
}

