import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsBoardComponent } from './client-board/clients-board.component';
import { ClientsProfileComponent } from './client-profile/clients-profile.component';
import { FirstLoginComponent } from './first-login/first-login.component';
import { coachGuard } from '../../core/auth/coach.guard';
import { clientProfileGuard } from '../../core/auth/client-profile.guard';

const routes: Routes = [
  { path: '', component: ClientsBoardComponent, canActivate: [coachGuard] },
  {
    path: 'profile/:id',
    component: ClientsProfileComponent,
    canActivate: [clientProfileGuard],
  },
  {
    path: 'set-up-password',
    component: FirstLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
