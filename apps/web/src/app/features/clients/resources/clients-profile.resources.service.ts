import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ClientGeneralDetails,
  ClientFitnessDetails,
  ClientPermissions,
  ClientGoalResponse,
} from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientsProfileResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  getClientDetails(id: string): Observable<ClientGeneralDetails> {
    return this.http.get<ClientGeneralDetails>(
      this.endpoint + `/clients/details/${id}`
    );
  }
  getClientPermissions(id: string): Observable<ClientPermissions> {
    return this.http.get<ClientPermissions>(
      this.endpoint + `/clients/permissions/${id}`
    );
  }

  getClientGoals(clientId: string): Observable<ClientGoalResponse> {
    return this.http.get<ClientGoalResponse>(this.endpoint + '/client-goals', {
      params: { clientId },
    });
  }

  getClientFitnessDetails(id: string): Observable<ClientFitnessDetails> {
    return this.http.get<ClientFitnessDetails>(
      this.endpoint + `/clients/health/${id}`
    );
  }
}
