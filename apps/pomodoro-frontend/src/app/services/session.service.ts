import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../Model/user-model';
import { GetStorageSessions } from './helper';
import { PomodoroState, Session } from '../Model/session-model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  sessions$: BehaviorSubject<Session[] | null> = new BehaviorSubject<
    Session[] | null
  >(null);
  constructor(private http: HttpClient) {
    this.GetSessions()?.subscribe();
  }

  AddSession(session: Session) {
    console.log(session.state.toString())
    return this.http.post('api/session', {
      ...session,
      startDate: session.startTime,
      endDate: session.endTime,
      state:PomodoroState[session.state]
    });
  }
  GetSessions(): Observable<Session[] | null> {
    const userStorage = localStorage.getItem('user');
    if (!userStorage) {
      const sessions: undefined | Session[] = GetStorageSessions();
      if (sessions) {
        this.sessions$.next(sessions);
        return of(sessions);
      }
      this.sessions$.next(null);
      return of(null);
    }

    const user: User = JSON.parse(userStorage);
    return this.http
      .get<Session[]>('api/session', { params: { userID: user.id } })
      .pipe(
        tap((sessions: Session[]) => {
          this.sessions$.next(sessions);
        })
      );
  }
}
