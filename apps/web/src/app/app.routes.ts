import { Route } from '@angular/router';
import { securityGuard } from './core/auth/auth.guard';
import { loggedInGuard } from './core/auth/logged-in.guard';
import { coachGuard } from './core/auth/coach.guard';

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
    canActivate: [securityGuard, coachGuard],
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./features/clients/clients.routes').then(
        (m) => m.ClientsRoutingModule
      ),
    canActivate: [securityGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.routes').then(
        (m) => m.SettingsRoutingModule
      ),
    canActivate: [securityGuard],
  },
];
