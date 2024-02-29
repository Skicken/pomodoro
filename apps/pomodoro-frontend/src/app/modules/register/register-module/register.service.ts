import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../Model/user-model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  registerUser(data: { email: string; nickname: string; password: string }) {
    return this.http.post<User>('api/register', data).pipe((user) => {
      return user;
    });
  }
}
