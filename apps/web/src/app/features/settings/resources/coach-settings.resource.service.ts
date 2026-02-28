import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CoachPersonalProfile,
  CoachProfessionalProfile,
  CoachAvailabilityProfile,
} from '@forma-ws/domain';
import {
  UpdateCoachPersonalDto,
  UpdateCoachProfessionalDto,
  UpdateCoachAvailabilityDto,
} from '@forma-ws/frontend/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoachSettingsResourceService extends GlobalAuthService {
  private http = inject(HttpClient);

  getPersonalProfile(): Observable<CoachPersonalProfile> {
    return this.http.get<CoachPersonalProfile>(
      `${this.endpoint}/coach/profile/personal`
    );
  }

  updatePersonalProfile(
    dto: UpdateCoachPersonalDto
  ): Observable<CoachPersonalProfile> {
    return this.http.put<CoachPersonalProfile>(
      `${this.endpoint}/coach/profile/personal`,
      dto
    );
  }

  getProfessionalProfile(): Observable<CoachProfessionalProfile> {
    return this.http.get<CoachProfessionalProfile>(
      `${this.endpoint}/coach/profile/professional`
    );
  }

  updateProfessionalProfile(
    dto: UpdateCoachProfessionalDto
  ): Observable<CoachProfessionalProfile> {
    return this.http.put<CoachProfessionalProfile>(
      `${this.endpoint}/coach/profile/professional`,
      dto
    );
  }

  getAvailabilityProfile(): Observable<CoachAvailabilityProfile> {
    return this.http.get<CoachAvailabilityProfile>(
      `${this.endpoint}/coach/profile/availability`
    );
  }

  updateAvailabilityProfile(
    dto: UpdateCoachAvailabilityDto
  ): Observable<CoachAvailabilityProfile> {
    return this.http.put<CoachAvailabilityProfile>(
      `${this.endpoint}/coach/profile/availability`,
      dto
    );
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/coach/account`);
  }
}
