import { map } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../Model/session-model';
import {formatDate} from '@angular/common';

@Component({
  selector: 'pomodoro-session-report',
  templateUrl: './session-report.component.html',
  styleUrl: './session-report.component.css',
})
export class SessionReportComponent implements OnInit{


  @Input({required:true})
  sessions:Session[] | null = []
  sessionGroups:Map<string,Session[]> = new Map<string,Session[]>


  ngOnInit(): void {
    console.log(this.sessions?.length)
    this.sessions?.forEach((element)=>{

      const key = new Date(element.startTime).toDateString();
      if(!this.sessionGroups.has(key))
      {
        this.sessionGroups.set(key,[])
      }
      this.sessionGroups.get(key)?.push(element)
    })
    console.log(this.sessionGroups)
  }
  formatTimeHeader(date:Date)
  {
    return new Date(date).toDateString()
  }
  formatTime(date:Date)
  {
      const value = new Date(date);
      return value.getHours()+":"+value.getMinutes()
  }

}
