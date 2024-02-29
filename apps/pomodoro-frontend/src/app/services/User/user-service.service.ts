import { Injectable } from '@angular/core';
import { User } from '../../Model/user-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User | null = null;
  constructor(
    private http: HttpClient,
  ) {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      this.user = JSON.parse(userStorage);
    }
  }

  registerUser(data: { email: string; nickname: string; password: string }) {
    return this.http.post<User>('api/user', data).pipe((user) => {
      return user;
    });
  }
}
