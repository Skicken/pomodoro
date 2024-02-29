import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Alarm, defaultAlarm } from '../../Model/alarm-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../Model/user-model';

@Injectable({
  providedIn: 'root',
})
export class AlarmService {
  alarms$: BehaviorSubject<Alarm[] | null> = new BehaviorSubject<
    Alarm[] | null
  >(null);
  playedAudio: HTMLAudioElement | null = null
  constructor(private http: HttpClient) {
    this.GetUserAlarms().subscribe();
  }
  GetUserAlarms(): Observable<Alarm[]> {
    const userStorage = localStorage.getItem('user');
    if (!userStorage) {
      console.log("no user")
      const data = [defaultAlarm]
      this.alarms$.next(data);
      return of(data);
    }
    const user: User = JSON.parse(userStorage);
    return this.http
      .get<Alarm[]>('api/alarm', { params: { userID: user.id } })
      .pipe(
        map((alarms: Alarm[]) => {
          const data: Alarm[] = [...alarms, defaultAlarm];
          this.alarms$.next(data);
          return data;
        })
      );
  }

  PlayAlarmID(id: number | null, volume = 100) {
    if (!id) {
      this.PlayAlarm(defaultAlarm, volume);
      return;
    }

    console.log('Playing Alarm');
    this.http.get<Alarm>(`api/alarm/${id}`).subscribe((alarm: Alarm) => {
      this.PlayAlarm(alarm,volume);
    });
  }
  DeleteAlarm(alarm: Alarm) {
    return this.http.delete(`api/alarm/${alarm.id}`).pipe();
  }
  AddAlarm(file: File) {
    const formData = new FormData();
    formData.append('alarm', file);
    return this.http.post<Alarm>('api/alarm', formData);
  }
  StopPlaying()
  {
    if(!this.playedAudio) return;
    this.playedAudio.pause();
    this.playedAudio.currentTime = 0;
    this.playedAudio = null;
  }
  PlayAlarm(alarm: Alarm, volume = 100) {
    console.log('Playing audio');
    if(this.playedAudio)
    {
      this.playedAudio.pause();
      this.playedAudio.currentTime = 0;
    }
    this.playedAudio = new Audio();
    this.playedAudio.src = 'http://127.0.0.1:3000/api/file/' + alarm.urlPath;
    this.playedAudio.load();

    this.playedAudio.volume = volume / 100;
    this.playedAudio.muted = false;
    this.playedAudio.play();
    this.playedAudio.addEventListener('ended', () => {
      this.playedAudio = null;
    });
  }
}
