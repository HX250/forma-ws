import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from './security.service';

export const securityGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if (!securityService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
