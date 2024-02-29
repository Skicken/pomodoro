import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../../Model/user-model';
import { catchError, map, tap } from 'rxjs';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | null = null;
  constructor(private http: HttpClient, backend: HttpBackend, private router:Router) {
    this.http = new HttpClient(backend);
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      this.user = JSON.parse(userStorage);
    }
  }
  refreshToken() {
    return this.http.post<User>('api/auth/refresh', {}).pipe(
      tap((user:User|null) => {
        if(user)
        {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(user));
          window.location.reload();
        }
      }),
      catchError((error:HttpErrorResponse,caught)=>{
        if(error.status == HttpStatusCode.Unauthorized)
        {
          this.logout().subscribe();
        }
        return caught;
      })
    );
  }
  loginUser(email: string, password: string) {
    const body = { username: email, password: password };
    return this.http.post<User>('api/auth/login', body).pipe(
      map((user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }
  registerUser(data: { email: string; nickname: string; password: string }) {
    return this.http.post<User>('api/register', data).pipe((user) => {
      return user;
    });
  }
  logout() {
    return this.http.post<User>('api/auth/logout', {}).pipe(tap(()=>{
      this.user = null
      localStorage.removeItem('user');
      localStorage.removeItem('selectedTemplate');
      window.location.reload();
    }));
  }
}
