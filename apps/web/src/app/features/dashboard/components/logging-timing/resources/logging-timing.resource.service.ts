import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggingTimingResponse } from '@forma-ws/domain';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingTimingResourceService {
  private readonly http = inject(HttpClient);

  getLoggingTiming(): Observable<LoggingTimingResponse> {
    return this.http.get<LoggingTimingResponse>('dashboard/logging-timing');
  }
}
