// logged-in.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from './security.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if (securityService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
