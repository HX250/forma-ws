import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = signal<boolean>(false);

  setLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  getIsLoggedIn() {
    return this.isLoggedIn.asReadonly();
  }
}
