import { InfoService } from './../../services/info.service';

import {
  Component,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';

@Component({
  selector: 'pomodoro-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  showUserOptions: boolean = false;
  onDropdownClick: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private info:InfoService
  ) {
    this.renderer.listen('window', 'click', () => {
      if (!this.onDropdownClick) {
        this.showUserOptions = false;
      }
      this.onDropdownClick = false;
    });
  }
  logout() {
    this.authService.logout().subscribe(()=>{
    });
  }
  openUserOptions() {
    this.onDropdownClick = true;
    this.showUserOptions = !this.showUserOptions;
  }
}
