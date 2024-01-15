import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const loginGuardGuard: CanActivateFn = (route, state) => {
  inject(TokenService)
  if(localStorage.getItem('user'))
  {
    return true;
  }
  return false;
};
