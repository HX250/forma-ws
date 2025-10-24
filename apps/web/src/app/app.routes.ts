import { Route } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { securityGuard } from '@forma-ws/frontend-shared';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DashboardRoutingModule
      ),
  },
];
