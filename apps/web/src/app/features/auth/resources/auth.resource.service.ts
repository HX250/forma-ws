import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponseDto, LoginDto } from '@forma-ws/frontend/domain';

@Injectable({
  providedIn: 'root',
})
export class AuthResourceService {
  constructor(private http: HttpClient) {}

  login(form: LoginDto) {
    return this.http.post<AuthResponseDto>('/api/auth/login', form);
  }

  logout() {
    return this.http.post('/api/auth/logout', {});
  }

  register(email: string, password: string) {
    return this.http.post('/api/auth/register', { email, password });
  }
}
