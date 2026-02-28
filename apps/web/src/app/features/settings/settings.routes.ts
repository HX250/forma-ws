import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoachSettingsComponent } from './coach-settings/coach-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: CoachSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
