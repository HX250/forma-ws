import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientTable } from '@forma-ws/domain';
import { RegisterClientDto } from '@forma-ws/frontend/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientsBoardResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  register(form: RegisterClientDto) {
    return this.http.post(this.endpoint + '/auth/register/client', form);
  }

  getClientList(coachId: string): Observable<ClientTable[]> {
    const params = new HttpParams().set('coachId', coachId);
    return this.http.get<ClientTable[]>(this.endpoint + '/clients', { params });
  }
}
