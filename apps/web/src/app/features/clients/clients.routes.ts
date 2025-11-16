import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsBoardComponent } from './clients-board.component';

const routes: Routes = [{ path: '', component: ClientsBoardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
