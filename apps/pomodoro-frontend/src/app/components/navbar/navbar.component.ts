import { InfoService } from './../../services/info.service';
import { PomodoroService } from './../../services/pomodoro.service';

import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { exampleTemplate } from '../../Model/mock-template';

@Component({
  selector: 'pomodoro-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  showUserOptions: boolean = false;
  onDropdownClick: boolean = false;

  constructor(
    public userService: UserService,
    private pomodoroService: PomodoroService,
    private templateService: TemplateService,
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
    this.pomodoroService.SetTemplate(exampleTemplate);
    this.templateService.ResetTemplates();
    this.userService.logout();
    this.info.openInfoBar("Succesfully logged out");
  }
  openUserOptions() {
    this.onDropdownClick = true;
    this.showUserOptions = !this.showUserOptions;
  }
}
