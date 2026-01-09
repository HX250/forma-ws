import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExerciseDetail,
  ExerciseSummary,
  ExerciseEntryDto,
} from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';

@Injectable()
export class ExerciseTrackingResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);

  searchExercises(query: string): Observable<ExerciseDetail[]> {
    return this.http.get<ExerciseDetail[]>(
      `${this.endpoint}/tracking/exercise/search`,
      {
        params: { q: query },
      }
    );
  }

  getExerciseById(id: string): Observable<ExerciseDetail> {
    return this.http.get<ExerciseDetail>(
      `${this.endpoint}/tracking/exercise/${id}`
    );
  }

  getExerciseData(params: {
    clientId: string;
    date: string;
  }): Observable<ExerciseSummary> {
    return this.http.get<ExerciseSummary>(
      this.endpoint + '/tracking/exercise',
      {
        params: { clientId: params.clientId, date: params.date },
      }
    );
  }

  logExerciseEntry(
    data: ExerciseEntryDto,
    clientId: string
  ): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.endpoint}/tracking/exercise/entries`,
      data,
      {
        params: { clientId },
      }
    );
  }

  removeExerciseEntry(params: {
    clientId: string;
    entryId: string;
  }): Observable<void> {
    return this.http.delete<void>(
      `${this.endpoint}/tracking/exercise/entries/${params.entryId}`,
      {
        params: { clientId: params.clientId },
      }
    );
  }
}
