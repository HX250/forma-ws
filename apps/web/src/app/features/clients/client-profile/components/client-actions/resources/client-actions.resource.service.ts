import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable()
export class ClientActionsResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  deleteClient(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/clients/${clientId}`);
  }
}
