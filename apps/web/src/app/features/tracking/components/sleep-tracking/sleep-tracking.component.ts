import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepEntry } from '@forma-ws/domain';

@Component({
  selector: 'app-sleep-tracking',
  imports: [CommonModule],
  templateUrl: './sleep-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SleepTrackingComponent {
  todayEntry = signal<SleepEntry | null>(null);

  ngOnInit() {
    this.loadTodayData();
  }

  loadTodayData() {}

  formatTime(dateString: Date): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
