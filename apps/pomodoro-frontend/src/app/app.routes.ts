import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ValidRegistrationComponent } from './pages/valid-registration/valid-registration.component';
import { PomodoroPageComponent } from './pages/pomodoro-page/pomodoro-page.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { loginGuard } from './guards/login.guard';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'valid-registration', component: ValidRegistrationComponent },

  {
    path: '',
    component: HomePageComponent,
    children: [
      {path:'',component:PomodoroPageComponent},
      {path:'user-settings',component:UserSettingsPageComponent},
      {path:'templates',component:TemplatePageComponent},
      {path:'report',component:ReportPageComponent,canActivate:[loginGuard]}

    ],
  },
];
