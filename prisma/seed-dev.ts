import { TemplateService } from './../apps/pomodoro-backend/src/app/Modules/pomodoro/Services/Template/template.service';
import { passwordHash } from './../apps/pomodoro-backend/src/app/Modules/common/common';

import { PrismaClient, SettingType, Template, User, UserType } from '@prisma/client';

const prisma = new PrismaClient();
export const seedDev = async () => {
  console.log('populating users...');
  populateUsers();

  console.log('populating setting names...');
  populateSettingNames();


};

const populateUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        id:1,
        nickname: 'johnny',
        email: 'johnny@gmail.pl',
        password: passwordHash('johnny'),
        userType: UserType.USER,
      },
      {
        id:2,
        nickname: 'Skicken',
        email: 'maks1444@gmail.pl',
        password: passwordHash('12345'),
        userType: UserType.ADMIN,
      },
      {
        id:3,
        nickname: 'Robert',
        email: 'test1@gmail.pl',
        password: passwordHash('12345'),
        userType: UserType.ADMIN,
      },
      {
        id:4,
        nickname: 'Maciek',
        email: 'test2@gmail.pl',
        password: passwordHash('12345'),
        userType: UserType.ADMIN,
      },
    ],
  });
};
const populateSettingNames = async () => {
  await prisma.settingName.createMany({
    data: [
      {
        name: 'pomodoro',
        type: SettingType.INT,
        defaultValue: '25',
      },
      {
        name: 'shortBreak',
        type: SettingType.INT,
        defaultValue: '5',
      },
      {
        name: 'longBreak',
        type: SettingType.INT,
        defaultValue: '10',
      },
      {
        name: 'sessionBeforeLongBreak',
        type: SettingType.INT,
        defaultValue: '3',
      },
      {
        name: 'pomodoroAutostart',
        type: SettingType.INT,
        defaultValue: '0',
      },
      {
        name: 'breakAutostart',
        type: SettingType.INT,
        defaultValue: '0',
      },
      {
        name: 'pomodoroAlert',
        type: SettingType.INT,
        defaultValue: '0',
      },
      {
        name: 'pomodoroAlertVolume',
        type: SettingType.INT,
        defaultValue: '100',
      },
      {
        name: 'breakAlert',
        type: SettingType.INT,
        defaultValue: '0',
      },
      {
        name: 'breakAlertVolume',
        type: SettingType.INT,
        defaultValue: '100',
      },
      {
        name: 'backgroundColor',
        type: SettingType.INT,
        defaultValue: '0',
      },
    ],
  });
};

