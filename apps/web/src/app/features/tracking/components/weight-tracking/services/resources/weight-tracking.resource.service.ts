import { Injectable } from '@angular/core';

@Injectable()
export class WeightTrackingResourceService {
  getWeightData(days: number): number[] {
    const data: number[] = [];
    const totalPoints = days === 1 ? 7 : days * 30;
    for (let i = 0; i < totalPoints; i++) {
      data.push(Math.floor(Math.random() * 30) + 50);
    }
    return data;
  }
}
