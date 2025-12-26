import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SetClientPasswordDto } from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';

@Injectable()
export class FirstLoginResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  setPassword(data: SetClientPasswordDto) {
    return this.http.post(this.endpoint + '/auth/set-password', data);
  }
}
