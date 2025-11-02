import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AuthPayload,
  LoginDto,
  RegisterCoachDto,
} from '@forma-ws/frontend/domain';
import { GlobalAuthService } from '../../../core/auth/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  login(form: LoginDto) {
    return this.http.post<AuthPayload>(this.endpoint + '/auth/login', form);
  }

  logout() {
    return this.http.post('/api/auth/logout', {});
  }

  register(form: RegisterCoachDto) {
    return this.http.post(this.endpoint + '/auth/register/coach', form);
  }

  getCurrentUser() {
    return this.http.get<AuthPayload>(this.endpoint + '/auth/me');
  }
}
