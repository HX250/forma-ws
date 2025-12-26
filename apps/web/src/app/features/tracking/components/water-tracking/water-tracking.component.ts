import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-water-tracking',
  imports: [CommonModule],
  templateUrl: './water-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterTrackingComponent {
  totalWater = signal<number>(0);
  waterGoal = signal<number>(2.5);

  ngOnInit() {
    this.loadTodayData();
  }

  loadTodayData() {}

  addWater(amount: number) {
    this.totalWater.update((current) => current + amount);
  }
}
