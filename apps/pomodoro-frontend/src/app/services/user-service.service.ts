import { Injectable } from '@angular/core';
import { User } from '../Model/user-model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { TemplateService } from './template.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null;
  constructor(
    private http: HttpClient,
    private templateService: TemplateService,
  ) {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      this.user = JSON.parse(userStorage);
    }
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
    return this.http.post<User>('api/user', data).pipe((user) => {
      return user;
    });
  }
}
