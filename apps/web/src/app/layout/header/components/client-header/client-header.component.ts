import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SharedNavComponent,
  NavLink,
} from '../shared-nav/shared-nav.component';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, SharedNavComponent],
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css'],
})
export class ClientHeaderComponent {
  linkClick = output<void>();

  navLinks: NavLink[] = [
    { route: '/dashboard', translationKey: 'HEADER.DASHBOARD', exact: true },
  ];

  onLinkClick() {
    this.linkClick.emit();
  }
}
