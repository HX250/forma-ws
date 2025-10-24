import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponseDto, LoginDto } from '@forma-ws/frontend/domain';
import { environment } from '../../../../../env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class DashboardResourceService {
  constructor(private http: HttpClient) {}

  endpoint = environment.API_END_POINT;

  setClientPassword(newPassword: string) {
    const body = { newPassword: newPassword };

    return this.http.post<AuthResponseDto>(
      this.endpoint + '/auth/client/set-password',
      body
    );
  }
}
