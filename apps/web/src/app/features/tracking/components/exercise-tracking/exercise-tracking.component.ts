import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseEntry, ExerciseSummary } from '@forma-ws/domain';

@Component({
  selector: 'app-exercise-tracking',
  imports: [CommonModule],
  templateUrl: './exercise-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseTrackingComponent {
  summary = signal<ExerciseSummary>({
    totalExercises: 0,
    totalDuration: 0,
    totalSets: 0,
    totalReps: 0,
    entries: [],
  });

  ngOnInit() {
    this.loadTodayData();
  }

  loadTodayData() {}

  private calculateSummary(entries: ExerciseEntry[]): ExerciseSummary {
    return {
      totalExercises: entries.length,
      totalDuration: entries.reduce((sum, e) => sum + (e.duration || 0), 0),
      totalSets: entries.reduce((sum, e) => sum + (e.sets || 0), 0),
      totalReps: entries.reduce((sum, e) => sum + (e.reps || 0), 0),
      entries: entries,
      lastExercise:
        entries.length > 0 ? entries[entries.length - 1] : undefined,
    };
  }
}
