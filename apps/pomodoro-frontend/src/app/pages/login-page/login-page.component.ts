import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pomodoro-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  errorMessage = '';
  correctForm = true;
  loginControl = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(private userService: UserService,private router:Router) {}
  onSubmit() {
    if (this.loginControl.invalid) {
      this.errorMessage = 'Enter valid credentials';
      this.correctForm = false;
      return;
    }
    const emailValue = this.loginControl.get('email')!.value!;
    const passwordValue = this.loginControl.get('password')!.value!;

    this.userService.loginUser(emailValue, passwordValue).subscribe({
      next: () => {
        console.log(this.userService.user);
        this.router.navigate(['']);
      },
      error: () => {
        this.errorMessage = 'User with such credentials does not exists';
        this.correctForm = false;
      },
    });
  }
}
