import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from './security.service';
import { UserType } from '@forma-ws/domain';

export const coachGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if (securityService.userType() === UserType.CLIENT) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
