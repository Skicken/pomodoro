import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'pomodoro-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  constructor(private userService: UserService,private router:Router) {}
  errorMessage = '';
  correctForm = true;
  registerControl = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      confirmPasswordValidator,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
  });

  onSubmit() {
    if (this.registerControl.invalid) {
      this.errorMessage = 'Enter valid credentials';
      this.correctForm = false;
      return;
    }
    const emailValue = this.registerControl.get('email')!.value!;
    const usernameValue = this.registerControl.get('username')!.value!;
    const passwordValue = this.registerControl.get('password')!.value!;
    console.log('registering user');
    console.log(emailValue, usernameValue, passwordValue);
    this.userService
      .registerUser({
        email: emailValue,
        nickname: usernameValue,
        password: passwordValue,
      })
      .subscribe({
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
          this.correctForm = false;
        },
        next:()=>
        {
          this.router.navigate(['valid-registration'])
            //if succesfully logged
        }
      });
  }
}
export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value === confirmPassword.value
    ? { confirmPassword: true }
    : null;
};
