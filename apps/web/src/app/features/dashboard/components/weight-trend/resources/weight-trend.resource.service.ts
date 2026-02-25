import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WeightTrendDto } from '@forma-ws/domain';
import { Observable } from 'rxjs';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
@Injectable()
export class WeightTrendResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getWeightTrend(): Observable<WeightTrendDto> {
    return this.http.get<WeightTrendDto>(
      this.endpoint + '/dashboard/weight-trend'
    );
  }
}
