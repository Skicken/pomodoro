import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { exampleTemplate } from '../Model/mock-template';
import { Template } from '../Model/template-model';


export enum PomodoroState
{
  SESSION,
  LONG_BREAK,
  SHORT_BREAK,
}
@Injectable({
  providedIn: 'root',
})
export class PomodoroService {

  selectedTemplate: Template = exampleTemplate;
  countDown: Subscription | null;
  isPlaying = false;
  pomodoroTimer = 600;
  state:PomodoroState = PomodoroState.SESSION;
  PomodoroStateType = PomodoroState;
  sessionsMade = 0;
  constructor() {
    this.countDown = null;
    this.SetTemplate(exampleTemplate);
  }
  SetTemplate(template:Template)
  {
    this.selectedTemplate = template;
    this.SetPlaying(false);
    this.SetSessionState();

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
      this.countDown = timer(0, 1000).subscribe(() => {
        --this.pomodoroTimer;
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

  TimerEnd() {
    const pomodoroAutostart = this.selectedTemplate.GetKey("pomodoroAutostart")
    const breakAutostart = this.selectedTemplate.GetKey("breakAutostart");
    const sessionBeforeLongBreak = this.selectedTemplate.GetKey("sessionBeforeLongBreak");
    //TODO: Save session


    if(this.InSession() && this.sessionsMade%sessionBeforeLongBreak)
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

