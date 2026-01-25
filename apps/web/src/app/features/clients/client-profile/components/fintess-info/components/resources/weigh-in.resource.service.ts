import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WeighInResponse } from '@forma-ws/frontend/domain';
import { AddWeighInDto } from '@forma-ws/frontend/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable()
export class WeighInResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  logDailyWeighIn(clientId: string, dto: AddWeighInDto): Observable<boolean> {
    return this.http.post<boolean>(this.endpoint + '/tracking/weight', dto, {
      params: { clientId: clientId },
    });
  }

  getDailyData(clientId: string): Observable<WeighInResponse> {
    return this.http.get<WeighInResponse>(this.endpoint + '/tracking/weight', {
      params: { clientId: clientId },
    });
  }
}
