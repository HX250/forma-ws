import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WeightTrendResponse } from '@forma-ws/domain';
import { Observable } from 'rxjs';

@Injectable()
export class ClientsGrowthResourceService {
  private readonly http = inject(HttpClient);

  getChartConfig(): Observable<WeightTrendResponse> {
    return this.http.get<WeightTrendResponse>('dashboard/clients-growth');
  }
}
