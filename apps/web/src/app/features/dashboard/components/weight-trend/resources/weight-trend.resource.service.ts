import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WeightTrendDto } from '@forma-ws/domain';
import { Observable } from 'rxjs';

@Injectable()
export class WeightTrendResourceService {
  private readonly http = inject(HttpClient);

  getWeightTrend(): Observable<WeightTrendDto> {
    return this.http.get<WeightTrendDto>('dashboard/weight-trend');
  }
}
