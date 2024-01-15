
import { Injectable } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { exampleTemplate } from '../Model/mock-template';
import { Template } from '../Model/template-model';
import { TemplateService } from './template.service';


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
  constructor(private templateService:TemplateService) {
    this.countDown = null;
    this.SetDefaultSelected();

  }
  SetDefaultSelected()
  {
    this.templateService.GetTemplates().subscribe((templates:Template[])=>{
      const defaultTemplate = this.templateService.templates.find((element)=>{return element.isDefault});
      const selectedTemplate = localStorage.getItem("selectedTemplate");
      if(selectedTemplate)
      {
        const template:Template = JSON.parse(selectedTemplate);
        const foundTemplate:Template | undefined = this.templateService.templates.find((element)=>{return element.id== template.id});
        if(foundTemplate)
        {
          this.SetTemplate(foundTemplate);
        }
      }
      if(defaultTemplate)
      {
        this.SetTemplate(defaultTemplate);
      }
    })
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

