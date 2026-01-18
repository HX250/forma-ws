import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientGoalDto, ClientGoalResponse, GoalType } from '@forma-ws/domain';
import { ClientGoalResourceService } from './resources/clients-goals.resource.service';

@Component({
  selector: 'app-edit-client-goal',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-client-goals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientGoalResourceService],
})
export class EditClientGoalComponent {
  private readonly clientGoalResourceService = inject(
    ClientGoalResourceService
  );

  clientId!: string;
  currentGoal!: ClientGoalResponse | null;

  GoalType = GoalType;
  goalTypeOptions = [
    { value: GoalType.LOSE_WEIGHT, label: 'Lose Weight' },
    { value: GoalType.GAIN_WEIGHT, label: 'Gain Weight' },
    { value: GoalType.MAINTAIN_WEIGHT, label: 'Maintain Weight' },
    { value: GoalType.BUILD_MUSCLE, label: 'Build Muscle' },
    { value: GoalType.IMPROVE_ENDURANCE, label: 'Improve Endurance' },
    { value: GoalType.GENERAL_FITNESS, label: 'General Fitness' },
  ];

  modalRef!: { close: (result?: any) => void };

  formData = signal<ClientGoalDto>({
    goalType: [],
    targetWeight: undefined,
    targetDate: undefined,
    caloriesGoal: undefined,
    proteinTarget: undefined,
    carbTarget: undefined,
    fatTarget: undefined,
    fiberTarget: undefined,
    sugarTarget: undefined,
    sleepGoal: undefined,
    waterGoal: undefined,
    weightGoal: undefined,
    exerciseGoal: undefined,
  });

  ngOnInit() {
    if (this.currentGoal) {
      this.formData.set({
        goalType: this.currentGoal.generalGoals.goalType || [],
        targetWeight: this.currentGoal.generalGoals.targetWeight,
        targetDate: this.currentGoal.generalGoals.targetDate.toString(),
        caloriesGoal: this.currentGoal.trackingGoal.nutritionGoals.caloriesGoal,
        proteinTarget:
          this.currentGoal.trackingGoal.nutritionGoals.proteinTarget,
        carbTarget: this.currentGoal.trackingGoal.nutritionGoals.carbTarget,
        fatTarget: this.currentGoal.trackingGoal.nutritionGoals.fatTarget,
        fiberTarget: this.currentGoal.trackingGoal.nutritionGoals.fiberTarget,
        sugarTarget: this.currentGoal.trackingGoal.nutritionGoals.sugarTarget,
        sleepGoal: this.currentGoal.trackingGoal.sleepGoal,
        waterGoal: this.currentGoal.trackingGoal.waterGoal,
        weightGoal: this.currentGoal.generalGoals.targetWeight,
        exerciseGoal: this.currentGoal.trackingGoal.exerciseGoal,
      });
    }
  }

  toggleGoalType(type: GoalType) {
    const current = this.formData();
    const types = [...current.goalType];
    const index = types.indexOf(type);

    if (index > -1) {
      types.splice(index, 1);
    } else {
      types.push(type);
    }

    this.formData.set({ ...current, goalType: types });
  }

  isGoalTypeSelected(type: GoalType): boolean {
    return this.formData().goalType.includes(type);
  }

  updateField(field: keyof ClientGoalDto, value: any) {
    this.formData.set({ ...this.formData(), [field]: value });
  }

  save() {
    this.clientGoalResourceService
      .createOrUpdateGoal(this.clientId, this.formData())
      .subscribe(() => {
        this.modalRef.close(true);
      });
  }

  cancel() {
    this.modalRef.close(false);
  }
}
