
import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { defaultTemplate } from '../../Model/mock-template';
import { Template } from '../../Model/template-model';
import { PomodoroState, Session } from '../../Model/session-model';
import { SessionService } from '../Session/session.service';
import { AlarmService } from '../Alarm/alarm.service';
import { NavigationStart, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class PomodoroService {

  selectedTemplate: Template = defaultTemplate;
  countDown: Subscription | null;
  isPlaying = false;
  pomodoroTimer = 600;
  PomodoroStateType = PomodoroState;
  currentSession:Session = {
    state: PomodoroState.SESSION,
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    templateID: 0
  };
  sessionsMade = 0;

  constructor(private sessionService:SessionService,private alarmService:AlarmService,private router:Router) {
    this.countDown = null;

    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationStart) {
        this.PomodoroButton()
      }
    })
  }
  SetTemplate(template:Template)
  {
    this.selectedTemplate = template;
    this.StopPlaying()
    this.SetSessionState();
    localStorage.setItem("selectedTemplate",JSON.stringify(this.selectedTemplate))
  }
  SetTimer(minutes:number)
  {
    this.pomodoroTimer = minutes*60;
  }
  StopPlaying()
  {
    this.isPlaying =false;
    this.countDown?.unsubscribe();
    this.countDown = null;
  }

  StartPlaying()
  {
    this.isPlaying = true;
    this.currentSession.startTime= new Date(Date.now());
    this.currentSession.templateID = this.selectedTemplate.id;
    let previousTimestamp = Date.now();
    let pomodoroTimerMili = this.pomodoroTimer*1000;
    this.countDown = timer(0, 1000).subscribe(() => {

      const currentTimestamp = Date.now();
      pomodoroTimerMili-= (currentTimestamp - previousTimestamp);
      this.pomodoroTimer = pomodoroTimerMili/1000;
      previousTimestamp = currentTimestamp;
      if(this.pomodoroTimer<=0)
      {
        this.TimerEnd();
      }
    });

  }
  StopResumeButton() {
    if(this.isPlaying)
    {
      this.StopPlaying()
    }
    else
    {
      this.StartPlaying();
    }
  }
  PomodoroButton() {
    this.StopPlaying();
    this.SetSessionState();
  }
  ShortBreakButton() {
    this.StopPlaying();
    this.SetShortBreakState();
  }
  LongBreakButton() {
    this.StopPlaying();
    this.SetLongBreakState()
  }
  SetSessionState()
  {
    const time = this.selectedTemplate.GetKey("pomodoro")
    this.SetTimer(time);
    this.currentSession.state = PomodoroState.SESSION;
  }
  SetShortBreakState()
  {
    const time = this.selectedTemplate.GetKey("shortBreak");
    this.SetTimer(time);
    this.currentSession.state = PomodoroState.SHORT_BREAK;
  }
  SetLongBreakState()
  {
    const time = this.selectedTemplate.GetKey("longBreak")
    this.SetTimer(time);
    this.currentSession.state = PomodoroState.LONG_BREAK;
  }
  InSession()
  {
    return this.currentSession.state === PomodoroState.SESSION;
  }
  InBreak()
  {
    return (this.currentSession.state===PomodoroState.SHORT_BREAK || this.currentSession.state===PomodoroState.LONG_BREAK);
  }
  PlayTemplateAlarm()
  {
    let alarmID = 0;
    let volume = 0.; //volume is stored between 0 - 100
    if(this.currentSession.state != PomodoroState.SESSION)
    {
      alarmID= this.selectedTemplate.GetKey("pomodoroAlert");
      volume = this.selectedTemplate.GetKey("pomodoroAlertVolume");

    }
    else
    {
      alarmID = this.selectedTemplate.GetKey("breakAlert");
      volume = this.selectedTemplate.GetKey("breakAlertVolume");
    }
    this.alarmService.PlayAlarmID(alarmID,volume);
  }
  SaveSession()
  {
    const currentDate = new Date(Date.now());
    this.currentSession.endTime = currentDate;
    this.sessionService.AddSession(this.currentSession).subscribe();
    this.currentSession.startTime = currentDate

  }
  TimerEnd() {


    this.StopPlaying()
    this.PlayTemplateAlarm()
    this.SaveSession()


    //Changing State of Pomodoro
    const pomodoroAutostart = this.selectedTemplate.GetKey("pomodoroAutostart")
    const breakAutostart = this.selectedTemplate.GetKey("breakAutostart");
    const sessionBeforeLongBreak = this.selectedTemplate.GetKey("sessionBeforeLongBreak");

    if(this.InSession() && this.sessionsMade%sessionBeforeLongBreak==0)
    {
      this.SetShortBreakState();
      if(breakAutostart) this.StartPlaying()
    }
    else if(this.InSession())
    {
      this.SetLongBreakState();
      if(breakAutostart) this.StartPlaying()
    }
    else
    {
      this.SetSessionState();
      if(pomodoroAutostart) this.StartPlaying();
    }
    console.log(this.pomodoroTimer)
    this.sessionsMade++;
  }
}

