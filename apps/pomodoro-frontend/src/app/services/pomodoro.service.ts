import { Injectable } from '@angular/core';
import { PomdoroState } from '@prisma/client';
import { Subscription, timer } from 'rxjs';


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
  countDown: Subscription | null;
  isPlaying = false;
  pomodoroTimer = 600;
  state:PomodoroState = PomodoroState.SESSION;
  PomodoroStateType = PomodoroState;
  constructor() {
    this.countDown = null;
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
    this.pomodoroTimer = 600;
    this.state = PomodoroState.SESSION;
  }
  ShortBreakButton() {
    this.SetPlaying(false);
    this.pomodoroTimer = 500;
    this.state = PomodoroState.SHORT_BREAK;

  }
  LongBreakButton() {
    this.SetPlaying(false);
    this.pomodoroTimer = 300;
    this.state = PomodoroState.LONG_BREAK;
  }
  TimerEnd() {}
}

