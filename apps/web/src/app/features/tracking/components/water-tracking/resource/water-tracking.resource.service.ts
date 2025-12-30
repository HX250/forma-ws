import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WaterData } from '@forma-ws/domain';
import {
  GetWaterData,
  AddWaterData,
  DeleteWaterData,
} from '@forma-ws/frontend/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable()
export class WaterTrackingResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  getWaterData(dto: GetWaterData): Observable<WaterData[]> {
    const params = new HttpParams()
      .set('clientId', dto.clientId)
      .set('createdAt', dto.createdAt);

    return this.http.get<WaterData[]>(this.endpoint + '/tracking/water', {
      params,
    });
  }

  logWaterData(dto: AddWaterData): Observable<boolean> {
    return this.http.post<boolean>(this.endpoint + '/tracking/water', dto);
  }

  removeWaterEntry(dto: DeleteWaterData): Observable<boolean> {
    const params = new HttpParams()
      .set('clientId', dto.clientId)
      .set('id', dto.id);

    return this.http.delete<boolean>(this.endpoint + '/tracking/water', {
      params,
    });
  }
}
