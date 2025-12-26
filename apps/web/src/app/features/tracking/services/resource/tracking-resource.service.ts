import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalAuthService } from '../../../../core/auth/auth';

@Injectable({
  providedIn: 'root',
})
export class TrackingResourceService extends GlobalAuthService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  updatePermission(
    clientId: string,
    permissionType: string,
    value: boolean
  ): Observable<boolean> {
    return this.http.post<boolean>(
      this.endpoint + '/tracking/updatePermission',
      {
        clientId,
        permissionType,
        value,
      }
    );
  }
}
