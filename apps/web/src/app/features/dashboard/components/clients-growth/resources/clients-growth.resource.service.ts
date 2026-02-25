import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientsGrowthResponse } from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable()
export class ClientsGrowthResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getChartConfig(
    coachId: string,
    span: number
  ): Observable<ClientsGrowthResponse> {
    return this.http.get<ClientsGrowthResponse>(
      this.endpoint + '/dashboard/clients-growth',
      { params: { coachId, span: span.toString() } }
    );
  }
}
