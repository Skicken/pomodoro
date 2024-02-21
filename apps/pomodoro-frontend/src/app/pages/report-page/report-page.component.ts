import { SessionService } from '../../services/Session/session.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pomodoro-report-page',
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.css',
})
export class ReportPageComponent implements OnInit {

  constructor(public sessionService:SessionService)
  {

  }
  ngOnInit(): void {
    this.sessionService.GetSessions().subscribe((data)=>{
      console.log(data);
    })
  }
  formatTime(date:Date)
  {
      const value = new Date(date);

      return value.toLocaleDateString()+" "+value.toLocaleTimeString();
  }
}
