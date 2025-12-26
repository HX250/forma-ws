import { Injectable, signal, computed } from '@angular/core';
import { AuthPayload, UserAuthDetails } from '@forma-ws/domain';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private isLoggedIn = signal<boolean>(false);
  private currentUser = signal<UserAuthDetails | null>(null);
  private authPayload = signal<AuthPayload | null>(null);

  isAuthenticated = computed(() => this.isLoggedIn());
  user = computed(() => this.currentUser());
  userId = computed(() => this.authPayload()?.sub || null);
  userType = computed(() => this.authPayload()?.userType || null);

  setLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  getIsLoggedIn() {
    return this.isLoggedIn.asReadonly();
  }

  setCurrentUser(user: UserAuthDetails) {
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
    this.currentUser.set(null);
    this.authPayload.set(null);
  }
}
