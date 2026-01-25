import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ExerciseDetail } from '@forma-ws/domain';
import { ExerciseEntryDto } from '@forma-ws/frontend/domain';
import {
  AlertService,
  AlertType,
  ButtonComponent,
  PageAutocomplete,
  PageFormComponent,
  FormaFormContainer,
  FormUtils,
  PageInputComponent,
  PageNumberComponent,
} from '@forma-ws/frontend-shared';
import { ExerciseTrackingResourceService } from '../resources/exercise-tracking.resource.service';
import { ExerciseTrackingFormModel } from '../models/exercise-tracking-form.model';

@Component({
  selector: 'app-add-exercise-record',
  imports: [
    CommonModule,
    FormsModule,
    PageAutocomplete,
    PageInputComponent,
    PageNumberComponent,
    ButtonComponent,
  ],
  templateUrl: './add-exercise-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExerciseTrackingResourceService],
})
export class AddExerciseRecordComponent
  extends PageFormComponent<FormGroup<ExerciseTrackingFormModel>>
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly exerciseService = inject(ExerciseTrackingResourceService);
  private readonly alertService = inject(AlertService);

  clientId = signal<string>('');
  exerciseId = signal<string>('');
  selectedExercise = signal<ExerciseDetail | undefined>(undefined);

  searchResults = signal<
    { id: string; label: string; labelSk?: string; value: ExerciseDetail }[]
  >([]);

  modalRef!: { close: (result?: any) => void };

  get control() {
    return this.form.controls;
  }

  private selectedExerciseEffect = effect(() => {
    const exerciseId = this.exerciseId();
    if (!exerciseId) return;
    this.onExerciseSelected();
  });

  ngOnInit() {
    this.form = this.buildForm();
  }

  performSearch() {
    const query = this.control.exercise.controls.exerciseName.value;
    if (!query || query.length < 2) return;

    this.exerciseService.searchExercises(query).subscribe({
      next: (results) => {
        this.searchResults.set(
          results.map((ex) => ({
            id: ex.id,
            label: ex.name,
            labelSk: ex.nameSk,
            value: ex,
          }))
        );
      },
      error: () => this.searchResults.set([]),
    });
  }

  onExerciseSelected() {
    const exerciseId = this.exerciseId();

    this.exerciseService.getExerciseById(exerciseId).subscribe((exercise) => {
      this.selectedExercise.set(exercise);
      this.control.exercise.patchValue({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseNameSk: exercise.nameSk,
      });
    });
  }

  onSearchCleared() {
    this.exerciseId.set('');
    this.selectedExercise.set(undefined);
    this.searchResults.set([]);
    this.control.exercise.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const exercise = this.selectedExercise();
    if (!exercise) {
      this.alertService.show(AlertType.ERROR, 'Please select an exercise');
      return;
    }

    const formValue = this.form.getRawValue();

    const dto: ExerciseEntryDto = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseNameSk: exercise.nameSk,
      sets: formValue.sets,
      reps: formValue.reps,
      weight: formValue.weight,
      duration: formValue.duration,
      notes: formValue.notes,
    };

    this.exerciseService.logExerciseEntry(dto, this.clientId()).subscribe({
      next: (res) => {
        this.alertService.show(
          AlertType.SUCCESS,
          'Exercise logged successfully'
        );
        this.form.reset();
        this.onSearchCleared();
        this.modalRef?.close(res);
      },
      error: () => {
        this.alertService.show(AlertType.ERROR, 'Failed to log exercise');
      },
    });
  }

  private buildForm(): FormaFormContainer<
    FormGroup<ExerciseTrackingFormModel>
  > {
    return FormUtils.createFormGroup(
      this.fb.group({
        exercise: this.fb.group({
          exerciseId: this.fb.control('', { nonNullable: true }),
          exerciseName: this.fb.control('', {
            validators: [Validators.required],
            nonNullable: true,
          }),
          exerciseNameSk: this.fb.control('', { nonNullable: true }),
        }),
        sets: this.fb.control(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1)],
        }),
        reps: this.fb.control(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1)],
        }),
        weight: this.fb.control(0, {
          nonNullable: true,
          validators: [Validators.min(1)],
        }),
        duration: this.fb.control(0, {
          nonNullable: true,
          validators: [Validators.min(1)],
        }),
        notes: this.fb.control('', { nonNullable: true }),
      })
    );
  }
}
