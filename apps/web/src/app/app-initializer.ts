import { inject } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { AuthResourceService } from './features/auth/resources/auth.resource.service';
import { SecurityService } from './core/auth/security.service';

export function initializeAuth() {
  const authService = inject(AuthResourceService);
  const securityService = inject(SecurityService);

  return authService.getCurrentUser().pipe(
    tap((payload) => {
      securityService.setAuthPayload(payload);
    }),
    catchError(() => {
      securityService.clear();
      return of(null);
    })
  );
}
