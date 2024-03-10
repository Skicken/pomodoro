import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/Navbar/navbar.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './Interceptors/auth.interceptor';

import { PomodoroPageComponent } from './pages/pomodoro-page/pomodoro-page.component';
import { UserSettingsPageComponent } from './pages/user-settings-page/user-settings-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';
import { InputMinutesComponent } from './components/SettingInput/SettingInput.component';

import { AddTemplateDialogComponent } from './components/Dialogs/AddTemplateDialog/add-template-dialog.component';
import { ConfirmDialogComponent } from './components/Dialogs/ConfirmDialog/confirm-dialog.component';
import { SelectTemplateDialogComponent } from './components/Dialogs/SelectTemplateDialog/select-template-dialog.component';
import { InfoPopupComponent } from './components/Popups/InfoPopup/info-popup.component';

import { AuthModule } from './modules/auth/auth.module';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { MaterialModule } from './modules/material/material/material.module';
import { RegisterModule } from './modules/register/register-module/register-module.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ValidRegistrationComponent } from './pages/valid-registration/valid-registration.component';
import { TomatoComponent } from './components/TomatoComponent/Tomato.component';
import { AddAlarmDialogComponent } from './components/Dialogs/AddAlarmDialog/add-alarm-dialog.component';
import { DropZoneDirective } from './Directives/DropZone.directive';
import { ErrorPopupComponent } from './components/Popups/ErrorPopup/error-popup.component';
import { ChartReportComponent } from './components/GraphReport/chart-report.component';
import { SessionReportComponent } from './components/SessionsReport/session-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TemplateSettingsComponent } from './components/TemplateSettings/TemplateSettings.component';
import { SpotifyPlaylistDialogComponent } from './components/Dialogs/SpotifyPlaylistDialog/SpotifyPlaylistDialog.component';
import { SpotifyPlaylistComponent } from './components/Spotify-Playlist/spotify-playlist.component';
import { SpotifyStatusPageComponent } from './pages/spotify-status-page/spotify-status-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    LoginPageComponent,
    PomodoroPageComponent,
    UserSettingsPageComponent,
    TemplatePageComponent,
    InputMinutesComponent,
    RegisterPageComponent,
    ValidRegistrationComponent,
    AddTemplateDialogComponent,
    ConfirmDialogComponent,
    SelectTemplateDialogComponent,
    InfoPopupComponent,
    ReportPageComponent,
    TomatoComponent,
    AddAlarmDialogComponent,
    DropZoneDirective,
    ErrorPopupComponent,
    ChartReportComponent,
    SessionReportComponent,
    TemplateSettingsComponent,
    SpotifyPlaylistDialogComponent,
    SpotifyPlaylistComponent,
    SpotifyStatusPageComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RegisterModule,
    NgxChartsModule,
    AuthModule,
  ],
  bootstrap: [AppComponent],
})
export class PomodoroModule {}
