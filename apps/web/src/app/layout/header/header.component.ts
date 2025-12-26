import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserFullNamePipe } from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { UserAuthDetails, UserType } from '@forma-ws/domain';
import { SecurityService } from '../../core/auth/security.service';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { CoachHeaderComponent } from './components/coach-header/coach-header.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserFullNamePipe,
    TranslateModule,
    CoachHeaderComponent,
    ClientHeaderComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);

  private securityService = inject(SecurityService);
  private router = inject(Router);

  get userType(): UserType | null {
    return this.securityService.userType() || null;
  }

  get currentUser(): UserAuthDetails | null {
    return this.securityService.getCurrentUser()() || null;
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
    if (this.userType === UserType.CLIENT) {
      path = `/clients/${path}/${this.currentUser?.id}`;
    }

    this.router.navigate([path]);
    this.closeMobileMenu();
  }
}
