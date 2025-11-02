import { Route } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { securityGuard } from '@forma-ws/frontend-shared';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AuthRoutingModule),
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DashboardRoutingModule
      ),
  },
];
