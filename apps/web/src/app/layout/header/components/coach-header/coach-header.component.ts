import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SharedNavComponent,
  NavLink,
} from '../shared-nav/shared-nav.component';

@Component({
  selector: 'app-coach-header',
  standalone: true,
  imports: [CommonModule, SharedNavComponent],
  templateUrl: './coach-header.component.html',
  styleUrls: ['./coach-header.component.css'],
})
export class CoachHeaderComponent {
  navLinks: NavLink[] = [
    { route: '/dashboard', translationKey: 'HEADER.DASHBOARD', exact: true },
    { route: '/clients', translationKey: 'HEADER.CLIENTS' },
    { route: '/settings', translationKey: 'HEADER.SETTINGS' },
  ];
}
