
import { map } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Session } from '../../Model/session-model';
import {formatDate} from '@angular/common';
import { SessionService } from '../../services/Session/session.service';

@Component({
  selector: 'pomodoro-session-report',
  templateUrl: './session-report.component.html',
  styleUrl: './session-report.component.css',
})
export class SessionReportComponent implements OnInit{


  @Input({required:true})
  sessions:Session[] | null = []
  sessionGroups:{group:string,sessions:Session[]}[] = []

  constructor(private sessionService:SessionService){}
  ngOnInit(): void {

    this.sessionService.GetSessions().subscribe((sessions:Session[] | null)=>{
      sessions?.forEach((element)=>{

        const key = new Date(element.startTime).toDateString();
        let group = this.sessionGroups.find((element)=>{
          return element.group===key;
        })
        if(!group)
        {
          this.sessionGroups.push({group:key,sessions:[] })
          group = this.sessionGroups.find((element)=>{
            return element.group===key;
          })
        }
        group?.sessions.push(element)
      })
      this.sessionGroups.sort((a,b)=>{
        return new Date(a.group).getTime()> new Date(b.group).getTime()?-1:1;
      })
      this.sessionGroups.forEach((group)=>{

        group.sessions.sort((a,b)=>{

          return new Date(a.startTime).getTime()> new Date(b.startTime).getTime()?-1:1;

        })
      })

    })

  }
  formatTimeHeader(date:Date)
  {
    return new Date(date).toDateString()
  }
  toTimeFormat(value:number)
  {
    return value>9?value.toString():'0'+value.toString();
  }
  formatTime(date:Date)
  {
      const value = new Date(date);
      return this.toTimeFormat(value.getHours())+":"+this.toTimeFormat(value.getMinutes())
  }

}
