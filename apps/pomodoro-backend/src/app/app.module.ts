import { Module } from '@nestjs/common';

import { AppController } from './Controllers/app.controller';
import { AppService } from './app.service';
import { TemplateController } from './Controllers/template/template.controller';
import { SessionController } from './Controllers/session/session.controller';
import { SettingNameController } from './Controllers/settingName/setting-name.controller';
import { SettingValueController } from './Controllers/settingValue/setting-value.controller';
import { TemplateServiceService } from './Services/Template/template-service.service';
import { UserService } from './Services/User/user.service';
import { SettingvalueService } from './Services/SettingValue/settingvalue.service';
import { SettingnameService } from './Services/SettingName/settingname.service';
import { SessionService } from './Services/Session/session.service';
import { PrismaService } from './Services/prisma.service';
import { UserController } from './Controllers/user/user.controller';
import { AlarmController } from './Controllers/alarm.controller';
import { AlarmService } from './Services/Alarm/alarm.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    TemplateController,
    SessionController,
    SettingNameController,
    SettingValueController,
    UserController,
    AlarmController

  ],
  providers: [
    AppService,
    TemplateServiceService,
    UserService,
    SettingvalueService,
    SettingnameService,
    SessionService,
    AlarmService,
    PrismaService
  ],
})
export class AppModule {}
