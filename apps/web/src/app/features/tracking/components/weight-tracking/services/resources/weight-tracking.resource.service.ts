import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChartSpaceValues, WeightTrackingResponse } from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';

@Injectable()
export class WeightTrackingResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  getWeightTracking(
    clientId: string,
    span: ChartSpaceValues
  ): Observable<WeightTrackingResponse> {
    return this.http.get<WeightTrackingResponse>(
      this.endpoint + `/tracking/weight/${clientId}/chart`,
      {
        params: { span: span.toString() },
      }
    );
  }
}
