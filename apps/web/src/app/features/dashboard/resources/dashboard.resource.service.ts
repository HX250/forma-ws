import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../env/dev.env';
import { AuthPayload } from '@forma-ws/frontend/domain';
@Injectable({
  providedIn: 'root',
})
export class DashboardResourceService {
  private readonly http = inject(HttpClient);

  endpoint = environment.API_END_POINT;

  setClientPassword(newPassword: string) {
    const body = { newPassword: newPassword };

    return this.http.post<AuthPayload>(
      this.endpoint + '/auth/client/set-password',
      body
    );
  }
}
