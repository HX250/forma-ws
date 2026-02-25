import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientEngagementResponse } from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable()
export class ClientEngagementResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getClientEngagement(): Observable<ClientEngagementResponse> {
    return this.http.get<ClientEngagementResponse>(
      this.endpoint + '/dashboard/client-engagement'
    );
  }
}
