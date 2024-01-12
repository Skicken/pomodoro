import { TemplateService } from './../apps/pomodoro-backend/src/app/Modules/pomodoro/Services/Template/template.service';
import { passwordHash } from './../apps/pomodoro-backend/src/app/Modules/common/common';

import { PrismaClient, Template, User, UserType } from '@prisma/client';

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
        defaultValue: 25,
      },
      {
        name: 'shortBreak',
        defaultValue: 5,
      },
      {
        name: 'longBreak',
        defaultValue: 10,
      },
      {
        name: 'sessionBeforeLongBreak',
        defaultValue: 3,
      },
      {
        name: 'pomodoroAutostart',
        defaultValue: 0,
      },
      {
        name: 'breakAutostart',
        defaultValue: 0,
      },
      {
        name: 'pomodoroAlert',
        defaultValue: 0,
      },
      {
        name: 'pomodoroAlertVolume',
        defaultValue: 100,
      },
      {
        name: 'breakAlert',
        defaultValue: 0,
      },
      {
        name: 'breakAlertVolume',
        defaultValue: 100,
      },
      {
        name: 'backgroundColor',
        defaultValue: 0,
      },
    ],
  });
};

