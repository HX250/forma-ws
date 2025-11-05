import { Injectable, signal, computed } from '@angular/core';
import { AuthPayload, Client, Coach } from '@forma-ws/frontend/domain';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private isLoggedIn = signal<boolean>(false);
  private currentUser = signal<Coach | Client>({} as Coach | Client);
  private authPayload = signal<AuthPayload>({} as AuthPayload);

  isAuthenticated = computed(() => this.isLoggedIn());
  user = computed(() => this.currentUser());
  userId = computed(() => this.authPayload().sub);
  userType = computed(() => this.authPayload().userType);

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

  setAuthPayload(payload: AuthPayload) {
    this.authPayload.set(payload);
    this.setLoggedIn(!!payload);
  }

  clear() {
    this.isLoggedIn.set(false);
    this.currentUser.set({} as Coach | Client);
    this.authPayload.set({} as AuthPayload);
  }
}
