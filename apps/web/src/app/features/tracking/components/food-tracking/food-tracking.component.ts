import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionEntry, NutritionSummary } from '@forma-ws/domain';

@Component({
  selector: 'app-food-tracking',
  imports: [CommonModule],
  templateUrl: './food-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodTrackingComponent {
  summary = signal<NutritionSummary>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealCount: 0,
    entries: [],
  });

  ngOnInit() {
    this.loadTodayData();
  }

  loadTodayData() {
    // TODO: Replace with actual API endpoint
    // this.http.get<NutritionEntry[]>('/api/nutrition/today').subscribe(entries => {
    //   const summary = this.calculateSummary(entries);
    //   this.summary.set(summary);
    // });
  }

  private calculateSummary(entries: NutritionEntry[]): NutritionSummary {
    return {
      totalCalories: entries.reduce((sum, e) => sum + e.calories, 0),
      totalProtein: entries.reduce((sum, e) => sum + (e.protein || 0), 0),
      totalCarbs: entries.reduce((sum, e) => sum + (e.carbs || 0), 0),
      totalFat: entries.reduce((sum, e) => sum + (e.fat || 0), 0),
      mealCount: entries.length,
      entries: entries,
    };
  }
}
