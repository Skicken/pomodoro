export interface Setting {
  id: number;
  settingNameID: number;
  key: string;
  value: number;
  ownerTemplateID:number;
  usedByTemplates:Template[]
}
export class Template {
  SetKey(key: string, value: number) {
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
    console.error('Could not find setting with: ', key);
    console.log(this.settings);
    return undefined;
  }
  GetKey(key: string): number {
    return this.GetKeySetting(key)!.value;
  }
  public constructor(init?: Partial<Template>) {
    Object.assign(this, init);
  }
}


export const pomodoroKey = 'pomodoro';
export const shortBreakKey = 'shortBreak';
export const longBreakKey = 'longBreak';
export const sessionsBeforeLongBreakKey = "sessionBeforeLongBreak"
export const pomodoroAutostartKey = 'pomodoroAutostart'
export const breakAutostartKey = 'breakAutostart'
export const pomodoroAlert = 'pomodoroAlert'
export const pomodoroAlertVolumeKey = 'pomodoroAlertVolume'
export const breakAlertKey = 'breakAlert'
export const breakAlertVolumeKey = 'breakAlertVolume'
export const backgroundColorKey = 'backgroundColor'
