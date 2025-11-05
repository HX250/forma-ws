import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecurityService } from '../../core/auth/security.service';
import { Router } from '@angular/router';
import { UserFullNamePipe } from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { SharedNavComponent, NavLink } from '../shared-nav/shared-nav.component';

@Component({
  selector: 'app-coach-header',
  standalone: true,
  imports: [CommonModule, RouterModule, UserFullNamePipe, TranslateModule, SharedNavComponent],
  templateUrl: './coach-header.component.html',
  styleUrls: ['./coach-header.component.css'],
})
export class CoachHeaderComponent {
  isMobileMenuOpen = signal(false);

  navLinks: NavLink[] = [
    { route: '/dashboard', translationKey: 'HEADER.DASHBOARD', exact: true },
    { route: '/clients', translationKey: 'HEADER.CLIENTS' },
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
