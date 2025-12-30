import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetSleepEntryDto,
  SleepEntryData,
  AddSleepEntryDto,
  DeleteSleepEntryDto,
} from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable()
export class SleepTrackingResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getSleepEntry(dto: GetSleepEntryDto): Observable<SleepEntryData | null> {
    const params = new HttpParams()
      .set('clientId', dto.clientId)
      .set('createdAt', dto.createdAt);

    return this.http.get<SleepEntryData | null>(
      this.endpoint + '/tracking/sleep',
      { params }
    );
  }

  logSleepEntry(dto: AddSleepEntryDto): Observable<SleepEntryData> {
    return this.http.post<SleepEntryData>(
      this.endpoint + '/tracking/sleep',
      dto
    );
  }

  removeSleepEntry(dto: DeleteSleepEntryDto): Observable<boolean> {
    const params = new HttpParams()
      .set('clientId', dto.clientId)
      .set('id', dto.id);

    return this.http.delete<boolean>(this.endpoint + '/tracking/sleep', {
      params,
    });
  }
}
