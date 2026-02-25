import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggingTimingResponse } from '@forma-ws/domain';
import { Observable } from 'rxjs';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
@Injectable()
export class LoggingTimingResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getLoggingTiming(): Observable<LoggingTimingResponse> {
    return this.http.get<LoggingTimingResponse>(
      this.endpoint + '/dashboard/logging-timing'
    );
  }
}
