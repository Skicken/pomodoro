import { Module } from '@nestjs/common';
import { AlarmController } from './Controllers/alarm.controller';
import { SessionController } from './Controllers/session.controller';
import { SettingNameController } from './Controllers/setting-name.controller';
import { SettingValueController } from './Controllers/setting-value.controller';
import { TemplateController } from './Controllers/template.controller';
import { UserController } from './Controllers/user.controller';
import { AlarmService } from './Services/Alarm/alarm.service';
import { SessionService } from './Services/Session/session.service';
import { SettingNameService } from './Services/SettingName/settingname.service';
import { SettingValueService } from './Services/SettingValue/settingvalue.service';
import { TemplateService } from './Services/Template/template.service';
import { UserService } from './Services/User/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { FileController } from './Controllers/FileController';
import { RegisterController } from './Controllers/registration.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    TemplateController,
    SessionController,
    SettingNameController,
    SettingValueController,
    FileController,
    UserController,
    AlarmController,
    RegisterController,
  ],
  providers: [
    TemplateService,
    UserService,
    SettingValueService,
    SettingNameService,
    SessionService,
    AlarmService,
  ],
})
export class PomodoroModule {}
