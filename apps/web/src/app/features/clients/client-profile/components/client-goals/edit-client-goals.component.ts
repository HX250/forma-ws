import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientGoalResponse, GoalType } from '@forma-ws/domain';
import { ClientGoalResourceService } from './resources/clients-goals.resource.service';
import {
  ButtonComponent,
  ButtonProperties,
  FormaFormContainer,
  FormUtils,
  HorizontalSelectComponent,
  PageDateComponent,
  PageFormComponent,
  PageNumberComponent,
  SelectOption,
} from '@forma-ws/frontend-shared';
import { ClinetGoalsModel } from './models/goals-form.model';

@Component({
  selector: 'app-edit-client-goal',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    PageDateComponent,
    PageNumberComponent,
    ButtonComponent,
    HorizontalSelectComponent,
  ],
  templateUrl: './edit-client-goals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientGoalResourceService],
})
export class EditClientGoalComponent extends PageFormComponent<
  FormGroup<ClinetGoalsModel>
> {
  private readonly clientGoalResourceService = inject(
    ClientGoalResourceService
  );
  private readonly fb = inject(FormBuilder).nonNullable;

  clientId!: string;
  currentGoal!: ClientGoalResponse | null;
  ButtonProperties = ButtonProperties;

  GoalType = GoalType;
  goalTypeOptions: SelectOption[] = [
    { value: 'LOSE_WEIGHT', label: 'Lose Weight' },
    { value: 'GAIN_WEIGHT', label: 'Gain Weight' },
    { value: 'MAINTAIN_WEIGHT', label: 'Maintain Weight' },
    { value: 'BUILD_MUSCLE', label: 'Build Muscle' },
    { value: 'IMPROVE_ENDURANCE', label: 'Improve Endurance' },
    { value: 'GENERAL_FITNESS', label: 'General Fitness' },
  ];

  modalRef!: { close: (result?: any) => void };

  get control() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.buildForm();

    if (this.currentGoal) {
      this.form.patchValue(this.mapToForm(this.currentGoal));
    }
  }

  save() {
    const payload = {
      ...this.form.getRawValue(),
      targetDate: this.control.targetDate.value.toISOString(),
    };

    this.clientGoalResourceService
      .createOrUpdateGoal(this.clientId, payload)
      .subscribe(() => {
        this.modalRef.close(true);
      });
  }

  cancel() {
    this.modalRef.close(false);
  }

  private toDateInputValue(date: string | Date | number): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private mapToForm(currentGoal: ClientGoalResponse) {
    return {
      goalType: currentGoal.generalGoals.goalType,
      targetWeight: currentGoal.generalGoals.targetWeight,
      targetDate: currentGoal.generalGoals.targetDate,
      caloriesGoal: currentGoal.trackingGoal.nutritionGoals.caloriesGoal,
      proteinTarget: currentGoal.trackingGoal.nutritionGoals.proteinTarget,
      carbTarget: currentGoal.trackingGoal.nutritionGoals.carbTarget,
      fatTarget: currentGoal.trackingGoal.nutritionGoals.fatTarget,
      fiberTarget: currentGoal.trackingGoal.nutritionGoals.fiberTarget,
      sugarTarget: currentGoal.trackingGoal.nutritionGoals.sugarTarget,
      sleepGoal: currentGoal.trackingGoal.sleepGoal,
      waterGoal: currentGoal.trackingGoal.waterGoal,
      weightGoal: currentGoal.generalGoals.weightGoal,
      exerciseGoal: currentGoal.trackingGoal.exerciseGoal,
    };
  }

  private buildForm(): FormaFormContainer<FormGroup<ClinetGoalsModel>> {
    return FormUtils.createFormGroup(
      this.fb.group({
        goalType: [[], Validators.required],
        targetWeight: [0, [Validators.min(0), Validators.max(1000)]],
        targetDate: [new Date()],
        caloriesGoal: [0],
        proteinTarget: [0],
        carbTarget: [0],
        fatTarget: [0],
        fiberTarget: [0],
        sugarTarget: [0],
        sleepGoal: [0],
        waterGoal: [0],
        weightGoal: [0],
        exerciseGoal: [0],
      })
    );
  }
}
