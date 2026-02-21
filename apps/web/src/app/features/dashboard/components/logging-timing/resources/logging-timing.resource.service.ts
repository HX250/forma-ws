import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LineChartConfig } from '@forma-ws/frontend-shared';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingTimingService {
  private readonly http = inject(HttpClient);

  getChartConfig(): Observable<LineChartConfig> {
    return this.http.get<LineChartConfig>('dashboard/logging-timing');
  }
}
