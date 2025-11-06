import { Component } from '@angular/core';
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
  protected title = 'Forma';

  constructor(private authService: SecurityService) {}

  get isLoggedIn() {
    return this.authService.getIsLoggedIn();
  }
}
