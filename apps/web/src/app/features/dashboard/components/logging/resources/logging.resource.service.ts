import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggingDto } from '@forma-ws/domain';
import { Observable } from 'rxjs';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';

@Injectable()
export class LoggingResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getLoggingActivity(): Observable<LoggingDto[]> {
    return this.http.get<LoggingDto[]>(this.endpoint + '/dashboard/logging');
  }
}
