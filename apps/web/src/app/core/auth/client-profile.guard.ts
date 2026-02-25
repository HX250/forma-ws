import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from './security.service';
import { UserType } from '@forma-ws/domain';

export const clientProfileGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if (securityService.userType() === UserType.CLIENT) {
    const userId = securityService.userId();
    const routeId = route.paramMap.get('id');

    if (routeId !== userId) {
      router.navigate(['/clients/profile', userId]);
      return false;
    }
  }

  return true;
};
