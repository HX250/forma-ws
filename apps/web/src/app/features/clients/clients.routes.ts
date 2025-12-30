import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsBoardComponent } from './client-board/clients-board.component';
import { ClientsProfileComponent } from './client-profile/clients-profile.component';
import { FirstLoginComponent } from './first-login/first-login.component';

const routes: Routes = [
  { path: '', component: ClientsBoardComponent },
  {
    path: 'profile/:id',
    component: ClientsProfileComponent,
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
