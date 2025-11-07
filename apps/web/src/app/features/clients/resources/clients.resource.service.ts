import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterClientDto } from '@forma-ws/frontend/domain';
import { GlobalAuthService } from '../../../core/auth/auth';
@Injectable({
  providedIn: 'root',
})
export class ClientResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  register(form: RegisterClientDto) {
    return this.http.post(this.endpoint + '/auth/register/client', form);
  }
}
