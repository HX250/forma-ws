import { GoalType } from '@forma-ws/frontend/domain';

export interface ClientGoalResponse {
  generalGoals: ClientGeneralGoalResponse;
  trackingGoal: ClientTrackingGoalResponse;
}

export interface ClientGeneralGoalResponse {
  goalType: GoalType[];
  weightGoal: number;
  targetDate: number;
  targetWeight: number;
}

export interface ClientTrackingGoalResponse {
  nutritionGoals: NutritionClientGoal;
  sleepGoal: number;
  waterGoal: number;
  exerciseGoal: number;
}

export interface NutritionClientGoal {
  caloriesGoal: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  fiberTarget: number;
  sugarTarget: number;
}
