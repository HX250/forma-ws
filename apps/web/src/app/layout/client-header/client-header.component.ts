import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecurityService } from '../../core/auth/security.service';
import { Router } from '@angular/router';
import { UserFullNamePipe } from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { SharedNavComponent, NavLink } from '../shared-nav/shared-nav.component';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, RouterModule, UserFullNamePipe, TranslateModule, SharedNavComponent],
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css'],
})
export class ClientHeaderComponent {
  isMobileMenuOpen = signal(false);

  navLinks: NavLink[] = [
    { route: '/dashboard', translationKey: 'HEADER.DASHBOARD', exact: true },
    { route: '/profile', translationKey: 'HEADER.PROFILE' }
  ];

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  get currentUser() {
    return this.securityService.getCurrentUser();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  logout() {
    this.securityService.clear();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  navigateAndClose(path: string) {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }
}
