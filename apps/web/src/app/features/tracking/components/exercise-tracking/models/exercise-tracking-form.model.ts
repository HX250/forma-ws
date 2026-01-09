import { FormControl, FormGroup } from '@angular/forms';

export interface ExerciseTrackingFormModel {
  exercise: FormGroup<SelectedExerciseFormModel>;
  sets: FormControl<number>;
  reps: FormControl<number>;
  weight: FormControl<number>;
  duration: FormControl<number>;
  notes: FormControl<string>;
}

export interface SelectedExerciseFormModel {
  exerciseId: FormControl<string>;
  exerciseName: FormControl<string>;
  exerciseNameSk: FormControl<string>;
}
