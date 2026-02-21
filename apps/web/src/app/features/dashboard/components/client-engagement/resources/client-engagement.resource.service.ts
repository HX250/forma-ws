import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientEngagementResponse } from '@forma-ws/domain';
import { Observable } from 'rxjs';

@Injectable()
export class ClientEngagementResourceService {
  private readonly http = inject(HttpClient);

  getClientEngagement(): Observable<ClientEngagementResponse> {
    return this.http.get<ClientEngagementResponse>(
      'dashboard/client-engagement'
    );
  }
}
