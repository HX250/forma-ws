import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkLightButton } from './layout/dark-light-button/dark-light-button.component';
import { AuthService } from './core/auth/auth.service';
import { LanguageSwitcher } from './layout/language-switcher/language-switcher.component';

@Component({
  imports: [RouterModule, DarkLightButton, LanguageSwitcher],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Forma';

  constructor(private authService: AuthService) {}

  get isLoggedIn() {
    return this.authService.getIsLoggedIn();
  }
}
