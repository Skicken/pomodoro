import { PomodoroService } from './../../services/pomodoro.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TemplateService } from '../../services/template.service';
import { AuthService } from '../../modules/auth/auth.service';
import { DeleteStorageTemplate } from '../../services/helper';

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
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  onSubmit() {
    if (this.loginControl.invalid) {
      this.errorMessage = 'Enter valid credentials';
      this.correctForm = false;
      return;
    }
    const emailValue = this.loginControl.get('email')!.value!;
    const passwordValue = this.loginControl.get('password')!.value!;

    this.authService.loginUser(emailValue, passwordValue).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.Unauthorized) {
          this.errorMessage = 'User with such credentials does not exists';
          this.correctForm = false;
        } else this.errorMessage = error.message;
      },
    });
  }
}
