import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponseDto, LoginDto } from '@forma-ws/frontend/domain';
import { environment } from '../../../../../env';
@Injectable({
  providedIn: 'root',
})
export class AuthResourceService {
  constructor(private http: HttpClient) {}

  endpoint = environment.API_END_POINT;

  login(form: LoginDto) {
    return this.http.post<AuthResponseDto>(this.endpoint + '/auth/login', form);
  }

  logout() {
    return this.http.post('/api/auth/logout', {});
  }

  register(email: string, password: string) {
    return this.http.post('/api/auth/register', { email, password });
  }
}
