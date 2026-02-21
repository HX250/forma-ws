import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggingDto } from '@forma-ws/domain';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingResourceService {
  private readonly http = inject(HttpClient);

  getLoggingActivity(): Observable<LoggingDto[]> {
    return this.http.get<LoggingDto[]>('dashboard/logging');
  }
}
