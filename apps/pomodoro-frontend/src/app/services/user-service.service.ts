import { Injectable } from '@angular/core';
import { User } from '../Model/user-model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null;
  constructor(private http: HttpClient) {
    const localUser = localStorage.getItem('user');
    if (localUser) this.user = JSON.parse(localUser);
  }
  refreshToken() {
    return this.http.post<User>('api/auth/refresh', {}).pipe(
      map((user) => {
        this.user = user;
        localStorage.setItem('user',JSON.stringify(user));

      })
    );
  }

  loginUser(email: string, password: string) {

    const body = { username: email, password: password };
    return this.http
      .post<User>('api/auth/login', body)
      .pipe(
        map((user) => {
          this.user = user;
          localStorage.setItem('user',JSON.stringify(user));

        })
      );
  }
  logout() {
    this.http.post<User>('api/auth/logout', {});
    localStorage.removeItem('user');
  }
  registerUser(data: { email: string; nickname: string; password: string }) {
    return this.http.post<User>('api/user', data).pipe((user) => {
      return user;
    });
  }
  getAccessToken(): string {
    if (!this.user?.access_token) return '';
    return this.user?.access_token;
  }
}
