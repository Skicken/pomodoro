import { Component } from '@angular/core';
import { PomodoroService } from '../../services/pomodoro.service';

@Component({
  selector: 'pomodoro-pomodoro-page',
  templateUrl: './pomodoro-page.component.html',
  styleUrl: './pomodoro-page.component.css',
})
export class PomodoroPageComponent {
  constructor(readonly pomodoroService:PomodoroService){}

  formatTimer(value:number):string
  {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}

