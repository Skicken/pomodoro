import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './services/user-service.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './Interceptors/auth.interceptor';
import { ValidRegistrationComponent } from './pages/valid-registration/valid-registration.component';
import { PomodoroPageComponent } from './pages/pomodoro-page/pomodoro-page.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';
import { MatDividerModule } from '@angular/material/divider';
import { InputMinutesComponent } from './components/SettingInput/SettingInput.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddTemplateDialogComponent } from './components/AddTemplateDialog/add-template-dialog.component';
import { ConfirmDialogComponent } from './components/ConfirmDialog/confirm-dialog.component';
import { SelectTemplateDialogComponent } from './components/SelectTemplateDialog/select-template-dialog.component';
import { InfoPopupComponent } from './components/InfoPopup/info-popup.component';
import { InfoService } from './services/info.service';
import { TemplateService } from './services/template.service';
import { AuthModule } from './modules/auth/auth.module';
import { ReportPageComponent } from './pages/report-page/report-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ValidRegistrationComponent,
    PomodoroPageComponent,
    UserSettingsPageComponent,
    TemplatePageComponent,
    InputMinutesComponent,
    AddTemplateDialogComponent,
    ConfirmDialogComponent,
    SelectTemplateDialogComponent,
    InfoPopupComponent,
    ReportPageComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UserService,
    InfoService,
    TemplateService,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDividerModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    AuthModule,
  ],
  bootstrap: [AppComponent],
})
export class PomodoroModule {}
