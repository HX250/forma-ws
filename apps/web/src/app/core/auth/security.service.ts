import { Injectable, signal, computed } from '@angular/core';
import { AuthPayload, UserAuthDetails } from '@forma-ws/domain';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private isLoggedIn = signal<boolean>(false);
  private currentUser = signal<UserAuthDetails | null>(null);

  isAuthenticated = computed(() => this.isLoggedIn());
  user = computed(() => this.currentUser());
  userId = computed(() => this.currentUser()?.id || null);
  userType = computed(() => this.currentUser()?.userType || null);

  setLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  getIsLoggedIn() {
    return this.isLoggedIn.asReadonly();
  }

  setCurrentUser(user: UserAuthDetails) {
    this.setLoggedIn(true);
    this.currentUser.set(user);
  }

  clear() {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }
}
