import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SecurityService } from './core/auth/security.service';
import {
  AlertComponent,
  DarkLightButton,
  LanguageSwitcher,
} from '@forma-ws/frontend-shared';
import { CoachHeaderComponent } from './layout/coach-header/coach-header.component';
import { ClientHeaderComponent } from './layout/client-header/client-header.component';
import { UserType } from '@forma-ws/domain';

@Component({
  imports: [
    RouterModule,
    DarkLightButton,
    LanguageSwitcher,
    AlertComponent,
    CoachHeaderComponent,
    ClientHeaderComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Forma';

  constructor(private authService: SecurityService) {}

  get isLoggedIn() {
    return this.authService.getIsLoggedIn();
  }

  get userType(): UserType {
    return this.authService.userType();
  }
}
