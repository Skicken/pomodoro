import { Module } from '@nestjs/common';
import { AlarmController } from './Controllers/alarm.controller';
import { SessionController } from './Controllers/session/session.controller';
import { SettingNameController } from './Controllers/settingName/setting-name.controller';
import { SettingValueController } from './Controllers/settingValue/setting-value.controller';
import { TemplateController } from './Controllers/template/template.controller';
import { UserController } from './Controllers/user/user.controller';
import { AlarmService } from './Services/Alarm/alarm.service';
import { SessionService } from './Services/Session/session.service';
import { SettingnameService } from './Services/SettingName/settingname.service';
import { SettingvalueService } from './Services/SettingValue/settingvalue.service';
import { TemplateServiceService } from './Services/Template/template-service.service';
import { UserService } from './Services/User/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RoleGuard } from '../auth/Guards/role.guard';

@Module({
  imports:[
    PrismaModule,
    AuthModule
  ],
  controllers: [
    TemplateController,
    SessionController,
    SettingNameController,
    SettingValueController,
    UserController,
    AlarmController,
  ],
  providers:[
    TemplateServiceService,
    UserService,
    SettingvalueService,
    SettingnameService,
    SessionService,
    AlarmService,


  ],


})
export class PomodoroModule {}
