import { Setting, Template } from "./template-model";

export const defaultTemplate= new Template({
  id: 0,
  settings: [
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "pomodoro",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "shortBreak",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "longBreak",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "sessionBeforeLongBreak",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "pomodoroAutostart",
      value: 0
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "breakAutostart",
      value: 0
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "pomodoroAlert",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "pomodoroAlertVolume",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "breakAlert",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "breakAlertVolume",
      value: 1
    },
    <Setting>{
      id: 0,
      settingNameID: 0,
      key: "backgroundColor",
      value: 1
    },
  ],
  isDefault: true,
  templateName: "Simple pomodoro"
})

export const mockList:Template[] = [defaultTemplate]
