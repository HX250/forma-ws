import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from './security.service';
import { UserType } from '@forma-ws/domain';

export const passwordGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if (securityService.user()?.isFirstLogin) {
    if (securityService.userType() === UserType.CLIENT) {
      router.navigate(['/clients/set-up-password']);
      return false;
    }
  }

  router.navigate(['/dashboard']);
  return true;
};
