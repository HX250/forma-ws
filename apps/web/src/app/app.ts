import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SecurityService } from './core/auth/security.service';
import {
  AlertComponent,
  DarkLightButton,
  LanguageSwitcher,
} from '@forma-ws/frontend-shared';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  imports: [
    RouterModule,
    DarkLightButton,
    LanguageSwitcher,
    AlertComponent,
    HeaderComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(SecurityService);

  protected title = 'Forma';

  get isLoggedIn() {
    return this.authService.getIsLoggedIn();
  }

  get isUserFirstTimeLogIn() {
    return this.authService.user()?.isFirstLogin;
  }
}
