import { Injectable, signal } from '@angular/core';
import { Client, Coach } from '@forma-ws/frontend/domain';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private isLoggedIn = signal<boolean>(false);
  private currentUser = signal<Coach | Client>('');

  setLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  getIsLoggedIn() {
    return this.isLoggedIn.asReadonly();
  }

  setCurrentUser(user: Coach | Client) {
    this.currentUser.set(user);
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }
}
