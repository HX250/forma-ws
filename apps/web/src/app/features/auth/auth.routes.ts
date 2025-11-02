import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { RegisterCoachComponent } from './components/register-coach/register-coach.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'register', component: RegisterCoachComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
