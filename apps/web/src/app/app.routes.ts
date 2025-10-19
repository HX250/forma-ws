import { Route } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
  },
];
