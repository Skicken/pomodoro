
import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { defaultTemplate } from '../../Model/mock-template';
import { Template } from '../../Model/template-model';
import { PomodoroState, Session } from '../../Model/session-model';
import { SessionService } from '../Session/session.service';
import { AlarmService } from '../Alarm/alarm.service';


@Injectable({
  providedIn: 'root',
})
export class PomodoroService {

  selectedTemplate: Template = defaultTemplate;
  countDown: Subscription | null;
  isPlaying = false;
  pomodoroTimer = 600;
  state:PomodoroState = PomodoroState.SESSION;
  PomodoroStateType = PomodoroState;
  currentSession:Session = {
    state: PomodoroState.SESSION,
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now()),
    templateID: 0
  };
  sessionsMade = 0;

  constructor(private sessionService:SessionService,private alarmService:AlarmService) {
    this.countDown = null;
  }
  SetTemplate(template:Template)
  {
    this.selectedTemplate = template;
    this.SetPlaying(false);
    this.SetSessionState();
    localStorage.setItem("selectedTemplate",JSON.stringify(this.selectedTemplate))
  }
  SetMinutes(minutes:number)
  {
    this.pomodoroTimer = minutes*60;
  }
  SetPlaying(isPlaying:boolean)
  {
    this.isPlaying = isPlaying;
    if (this.isPlaying)
    {

      this.currentSession.startTime= new Date(Date.now());
      this.currentSession.templateID = this.selectedTemplate.id;
      let previousTimestamp = Date.now();
      let pomodoroTimerMili = this.pomodoroTimer*1000;
      this.countDown = timer(0, 1000).subscribe(() => {

        const currentTimestamp = Date.now();
        pomodoroTimerMili-= (currentTimestamp - previousTimestamp);
        this.pomodoroTimer = pomodoroTimerMili/1000;
        previousTimestamp = currentTimestamp;
        if(this.pomodoroTimer<=0) this.TimerEnd();
      });
    }
    else {
      this.countDown?.unsubscribe();
      this.countDown = null;
    }
  }
  StopResumeButton() {
    this.SetPlaying(!this.isPlaying);
  }
  PomodoroButton() {
    this.SetPlaying(false);
    this.SetSessionState();
  }
  ShortBreakButton() {
    this.SetPlaying(false);
    this.SetShortBreakState();
  }
  LongBreakButton() {
    this.SetPlaying(false);
    this.SetLongBreakState()

  }
  SetSessionState()
  {
    console.log(this.selectedTemplate)
    this.SetMinutes(this.selectedTemplate.GetKey("pomodoro"));
    this.state = PomodoroState.SESSION;
  }
  SetShortBreakState()
  {
    this.SetMinutes(this.selectedTemplate.GetKey("shortBreak"));
    this.state = PomodoroState.SHORT_BREAK;
  }
  SetLongBreakState()
  {
    this.SetMinutes(this.selectedTemplate.GetKey("longBreak"));
    this.state = PomodoroState.LONG_BREAK;
  }
  InSession()
  {
    return this.state === PomodoroState.SESSION;
  }
  InBreak()
  {
    return (this.state===PomodoroState.SHORT_BREAK ||this.state===PomodoroState.LONG_BREAK);
  }
  PlayTemplateAlarm()
  {
    let alarmID = 0;
    let volume = 0.; //volume is stored between 0 - 100
    if(this.state != PomodoroState.SESSION)
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
    this.currentSession.state = this.state;
    this.currentSession.endTime = new Date(Date.now());
    this.sessionService.AddSession(this.currentSession).subscribe();

  }
  TimerEnd() {

    this.PlayTemplateAlarm()
    this.SaveSession()


    //Changing State of Pomodoro
    const pomodoroAutostart = this.selectedTemplate.GetKey("pomodoroAutostart")
    const breakAutostart = this.selectedTemplate.GetKey("breakAutostart");
    const sessionBeforeLongBreak = this.selectedTemplate.GetKey("sessionBeforeLongBreak");

    if(this.InSession() && this.sessionsMade%sessionBeforeLongBreak==0)
    {
      this.SetShortBreakState();
      if(!breakAutostart) this.SetPlaying(false)
    }
    else if(this.InSession())
    {
      this.SetLongBreakState();
      if(!breakAutostart) this.SetPlaying(false)
    }
    else
    {
      this.SetSessionState();
      if(!pomodoroAutostart) this.SetPlaying(false);
    }
    this.sessionsMade++;
  }
}

