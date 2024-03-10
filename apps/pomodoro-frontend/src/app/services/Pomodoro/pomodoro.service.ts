import { SnackBarService } from './../Snackbar/snack-bar.service';
import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { defaultTemplate } from '../../Model/mock-template';
import { SettingKey, Template } from '../../Model/template-model';
import { PomodoroState, Session } from '../../Model/session-model';
import { SessionService } from '../Session/session.service';
import { AlarmService } from '../Alarm/alarm.service';
import { NavigationStart, Router } from '@angular/router';
import { SpotifyService } from '../Spotify/spotify.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PomodoroService {
  selectedTemplate: Template = defaultTemplate;
  countDown: Subscription | null;
  isPlaying = false;
  inPause = true;
  pomodoroTimer = 600;
  PomodoroStateType = PomodoroState;
  currentSession: Session = {
    state: PomodoroState.SESSION,
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    templateID: 0,
  };
  sessionsMade = 0;
  spotifyPlaylistPlaying = false;
  constructor(
    private sessionService: SessionService,
    private alarmService: AlarmService,
    private router: Router,
    private spotifyService: SpotifyService,

  ) {
    this.countDown = null;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.PomodoroButton();
        this.spotifyService.PausePlaying().subscribe();
      }
    });
  }
  SetTemplate(template: Template) {
    this.selectedTemplate = template;
    this.StopPlaying();
    this.SetSessionState();
    localStorage.setItem(
      'selectedTemplate',
      JSON.stringify(this.selectedTemplate)
    );
  }
  SetTimer(minutes: number) {
    this.pomodoroTimer = minutes * 60;
  }
  StopPlaying() {
    this.isPlaying = false;
    this.countDown?.unsubscribe();
    this.countDown = null;
  }
  PausePlaying() {
    this.spotifyService.PausePlaying().subscribe({ error: (error) => {} });
    this.countDown?.unsubscribe();
    this.countDown = null;
    this.inPause = true;
  }
  ContinuePlaying() {
    this.inPause = false;
    this.spotifyService.ContinuePlaying().subscribe({ error: (error) => {} });
    this.StartTicking();
  }
  StartPlaying() {
    this.isPlaying = true;
    this.inPause = false;
    this.currentSession.startTime = new Date(Date.now());
    this.currentSession.templateID = this.selectedTemplate.id;
    this.StartPlayingPlaylist();
    this.StartTicking();
  }
  StartTicking() {
    let previousTimestamp = Date.now();
    let pomodoroTimerMili = this.pomodoroTimer * 1000;

    this.countDown = timer(0, 1000).subscribe(() => {
      const currentTimestamp = Date.now();
      pomodoroTimerMili -= currentTimestamp - previousTimestamp;
      this.pomodoroTimer = pomodoroTimerMili / 1000;
      previousTimestamp = currentTimestamp;
      if (this.pomodoroTimer <= 0) {
        this.countDown?.unsubscribe();
        this.countDown = null;
        this.TimerEnd();
      }
    });
  }
  StopResumeButton() {
    if (!this.isPlaying) {
      this.StartPlaying();
      return;
    }
    if (this.inPause) {
      this.ContinuePlaying();
    } else {
      this.PausePlaying();
    }
  }
  PomodoroButton() {
    this.sessionsMade = 0;
    this.StopPlaying();
    this.SetSessionState();
  }
  ShortBreakButton() {
    this.sessionsMade = 0;
    this.StopPlaying();
    this.SetShortBreakState();
  }
  LongBreakButton() {
    this.sessionsMade = 0;
    this.StopPlaying();
    this.SetLongBreakState();
  }
  SetSessionState() {
    const time = this.selectedTemplate.GetKey(SettingKey.pomodoroKey);
    this.SetTimer(time);
    this.currentSession.state = PomodoroState.SESSION;
  }
  SetShortBreakState() {
    const time = this.selectedTemplate.GetKey(SettingKey.shortBreakKey);
    this.SetTimer(time);
    this.currentSession.state = PomodoroState.SHORT_BREAK;
  }
  SetLongBreakState() {
    const time = this.selectedTemplate.GetKey(SettingKey.longBreakKey);
    this.SetTimer(time);
    this.currentSession.state = PomodoroState.LONG_BREAK;
  }
  InSession() {
    return this.currentSession.state === PomodoroState.SESSION;
  }
  InBreak() {
    return (
      this.currentSession.state === PomodoroState.SHORT_BREAK ||
      this.currentSession.state === PomodoroState.LONG_BREAK
    );
  }
  PlayTemplateAlarm() {
    let alarmID = 0;
    let volume = 0; //volume is stored between 0 - 100
    if (this.currentSession.state != PomodoroState.SESSION) {
      alarmID = this.selectedTemplate.GetKey(SettingKey.pomodoroAlert);
      volume = this.selectedTemplate.GetKey(SettingKey.pomodoroAlertVolumeKey);
    } else {
      alarmID = this.selectedTemplate.GetKey(SettingKey.breakAlertKey);
      volume = this.selectedTemplate.GetKey(SettingKey.breakAlertVolumeKey);
    }
    this.alarmService.PlayAlarmID(alarmID, volume);
  }
  SaveSession() {
    const currentDate = new Date(Date.now());
    this.currentSession.endTime = currentDate;
    this.sessionService.AddSession(this.currentSession).subscribe();
    this.currentSession.startTime = currentDate;
  }
  StartPlayingPlaylist() {
    if (this.currentSession.state == PomodoroState.SESSION) {
      const spotifyPlaylistURI = this.selectedTemplate.GetKeyString(
        SettingKey.spotifyPlaylist
      );
      console.log(spotifyPlaylistURI);
      if (spotifyPlaylistURI.length > 0) {
        this.spotifyService.PlayPlaylist(spotifyPlaylistURI).subscribe({
          error: () => {
            this.spotifyService.ContinuePlaying().subscribe({error:()=>{
            }});
          },
        });
      }
    }
  }
  HandlePlaylistOnTimerEnd() {
    if (this.currentSession.state != PomodoroState.SESSION) {
      const PlayOnBreak = this.selectedTemplate.GetKey(SettingKey.playOnBreak);
      if (PlayOnBreak == 0) {
        this.spotifyService.PausePlaying().subscribe();
      }
    }
    else
    {
      this.spotifyService.ContinuePlaying().subscribe();
    }
  }
  SetPomodoroState() {

    const sessionBeforeLongBreak = this.selectedTemplate.GetKey(
      SettingKey.sessionsBeforeLongBreakKey
    );
    if (this.InSession() && this.sessionsMade % sessionBeforeLongBreak == 0) {
      this.SetShortBreakState();
    } else if (this.InSession()) {
      this.SetLongBreakState();
    } else {
      this.SetSessionState();
    }
  }

  TimerEnd() {

    const pomodoroAutostart = this.selectedTemplate.GetKey(
      SettingKey.pomodoroAutostartKey
    );
    const breakAutostart = this.selectedTemplate.GetKey(
      SettingKey.breakAutostartKey
    );

    this.PlayTemplateAlarm();
    this.SaveSession();
    this.SetPomodoroState();
    if (
      (this.currentSession.state == PomodoroState.SESSION &&
        !pomodoroAutostart) ||
      (this.currentSession.state != PomodoroState.SESSION && !breakAutostart)
    ) {
      this.StopPlaying();
    }
    else
    {
      this.StartTicking();
    }
    this.HandlePlaylistOnTimerEnd();
    this.sessionsMade++;
  }
}
