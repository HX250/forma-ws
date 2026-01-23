import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientGoalDto } from '@forma-ws/frontend/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';

@Injectable()
export class ClientGoalResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  createOrUpdateGoal(
    clientId: string,
    dto: ClientGoalDto
  ): Observable<boolean> {
    return this.http.post<boolean>(this.endpoint + '/client-goals', dto, {
      params: { clientId },
    });
  }
}
