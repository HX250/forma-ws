import { inject } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { AuthResourceService } from './features/auth/resources/auth.resource.service';
import { SecurityService } from './core/auth/security.service';
import { UserType } from '@forma-ws/domain';

export function initializeAuth() {
  const authService = inject(AuthResourceService);
  const securityService = inject(SecurityService);

  return authService.getCurrentUser().pipe(
    tap((user) => {
      const userType = 'coachId' in user ? UserType.CLIENT : UserType.COACH;

      securityService.setAuthPayload({
        sub: user.id,
        email: user.email,
        userType: userType,
      });

      securityService.setCurrentUser(user);
    }),
    catchError(() => {
      securityService.clear();
      return of(null);
    })
  );
}
