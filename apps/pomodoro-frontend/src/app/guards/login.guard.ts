import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { InfoService } from '../services/info.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const info:InfoService = inject(InfoService)
  if(localStorage.getItem('user'))
  {
    return true;
  }
  info.openInfoBar("You must be logged to see reports")
  return false;
};
