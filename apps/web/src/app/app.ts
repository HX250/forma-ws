import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DarkLightButton } from './layout/dark-light-button/dark-light-button.component';
import { AuthService } from './core/auth/auth.service';

@Component({
  imports: [RouterModule, DarkLightButton],
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
