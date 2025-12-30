import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserFullNamePipe } from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { UserAuthDetails, UserType } from '@forma-ws/domain';
import { SecurityService } from '../../core/auth/security.service';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { CoachHeaderComponent } from './components/coach-header/coach-header.component';
import { AuthResourceService } from '../../features/auth/resources/auth.resource.service';

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
  private readonly securityService = inject(SecurityService);
  private readonly router = inject(Router);
  private readonly authResourceService = inject(AuthResourceService);

  isMobileMenuOpen = signal(false);

  UserType = UserType;

  get userType(): UserType | null {
    return this.securityService.userType() || null;
  }

  get currentUser(): UserAuthDetails | null {
    return this.securityService.user() || null;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  logout() {
    this.authResourceService.logout().subscribe(() => {
      this.securityService.clear();
      this.closeMobileMenu();
      this.router.navigate(['/']);
    });
  }

  navigateAndClose(path: string) {
    if (this.userType === UserType.CLIENT) {
      path = `/clients/${path}/${this.currentUser?.id}`;
    }

    this.router.navigate([path]);
    this.closeMobileMenu();
  }
}
