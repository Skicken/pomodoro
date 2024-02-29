import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SnackBarService } from '../services/Snackbar/snack-bar.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const info:SnackBarService = inject(SnackBarService)
  if(localStorage.getItem('user'))
  {
    return true;
  }
  info.openInfoBar("You must be logged in")
  return false;
};
