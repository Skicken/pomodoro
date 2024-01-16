import { BehaviorSubject, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Alarm, defaultAlarm } from '../Model/alarm-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../Model/user-model';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  alarms$:BehaviorSubject<Alarm[] | null> = new BehaviorSubject<Alarm[] | null>(null)
  constructor(private http:HttpClient) {

   }
   GetUserAlarms()
   {
    const userStorage = localStorage.getItem('user');
    if (!userStorage){

      return;
    }
    const user:User = JSON.parse(userStorage);
    this.http.get<Alarm[]>("api/alarm",{params:{userID:user.id}}).pipe(tap((alarms:Alarm[])=>{

      this.alarms$.next([...alarms,defaultAlarm]);
    }))
   }

   PlayAlarmID(id:number)
   {
    this.http.get<Alarm>(`api/alarm/${id}`).pipe(tap((alarm:Alarm)=>{
      this.PlayAlarm(alarm);
    }))

   }
   AddAlarm(file: File)
   {
    const formData = new FormData();
    formData.append('alarm', file);
    return this.http.post("api/alarm",formData);
   }
   PlayAlarm(alarm:Alarm)
   {
    console.log("playing audio")
    const audio = new Audio();

    audio.src="http://127.0.0.1:3000/api/file/"+alarm.urlPath
    audio.muted = false;
    audio.load();
    audio.play();
   }

}
