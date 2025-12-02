import { Route } from '@angular/router';
import { securityGuard } from './core/auth/auth.guard';
import { loggedInGuard } from './core/auth/logged-in.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AuthRoutingModule),
    canActivate: [loggedInGuard],
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DashboardRoutingModule
      ),
    canActivate: [securityGuard],
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./features/coach/clients/clients.routes').then(
        (m) => m.ClientsRoutingModule
      ),
    canActivate: [securityGuard],
  },
];
