import { FormControl } from '@angular/forms';
import { GoalType } from '@forma-ws/domain';

export interface ClinetGoalsModel {
  goalType: FormControl<GoalType[]>;
  targetWeight: FormControl<number>;
  targetDate: FormControl<Date>;
  caloriesGoal: FormControl<number>;
  proteinTarget: FormControl<number>;
  carbTarget: FormControl<number>;
  fatTarget: FormControl<number>;
  fiberTarget: FormControl<number>;
  sugarTarget: FormControl<number>;
  sleepGoal: FormControl<number>;
  waterGoal: FormControl<number>;
  weightGoal: FormControl<number>;
  exerciseGoal: FormControl<number>;
}
