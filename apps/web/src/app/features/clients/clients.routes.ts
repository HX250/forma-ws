import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsBoardComponent } from './client-board/clients-board.component';
import { ClientsProfileComponent } from './client-profile/clients-profile.component';

const routes: Routes = [
  { path: '', component: ClientsBoardComponent },
  {
    path: ':id',
    component: ClientsProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
