import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FoodDetailList,
  FoodDetail,
  NutritionEntry,
  NutritionSummary,
} from '@forma-ws/domain';
import { GlobalAuthService } from 'apps/web/src/app/core/auth/auth';

@Injectable()
export class FoodTrackingResourceService extends GlobalAuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/tracking/food';

  searchFoods(query: string): Observable<FoodDetailList[]> {
    return this.http.get<FoodDetailList[]>(
      this.endpoint + `/tracking/food/search`,
      {
        params: { food: query },
      }
    );
  }

  getFoodById(id: string, servingSize: number): Observable<FoodDetail> {
    return this.http.get<FoodDetail>(`${this.endpoint}/tracking/food/${id}`, {
      params: { servingSize },
    });
  }

  getNutritionEntries(params: {
    clientId: string;
    date: string;
  }): Observable<NutritionSummary> {
    return this.http.get<NutritionSummary>(this.endpoint + '/tracking/food', {
      params: {
        clientId: params.clientId,
        createdAt: params.date,
      },
    });
  }

  logNutritionEntry(data: NutritionEntry): Observable<boolean> {
    return this.http.post<boolean>(
      this.endpoint + '/tracking/food/entries',
      data
    );
  }

  removeNutritionEntry(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.endpoint}/tracking/food/entries/${id}`
    );
  }
}
