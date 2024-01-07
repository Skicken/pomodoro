import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'pomodoro-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  constructor(public userService:UserService,private router:Router){}
  logout()
  {
    this.userService.logout();
  }
}
