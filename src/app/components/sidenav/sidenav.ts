import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS, ROUTES } from '../../constants';

interface NavItem {
  label: string;
  routerLink: string;
  icon: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class SidenavComponent {
  protected readonly appName = APP_CONSTANTS.APP_NAME;

  protected readonly menuItems: NavItem[] = [
    { label: 'Home', icon: 'home', routerLink: ROUTES.HOME },
    { label: 'Speech to Text', icon: 'mic', routerLink: ROUTES.SPEECH_TO_TEXT }
  ];
}
