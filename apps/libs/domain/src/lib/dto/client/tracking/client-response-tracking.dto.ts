export interface ClientGeneralDetails {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  gender: string;
  birthDate: Date;
}

export interface ClientPermissions {
  canTrackExercise: boolean;
  canTrackSleep: boolean;
  canTrackNutrition: boolean;
  canTrackWater: boolean;
}

export interface ClientFitnessDetails {
  currentWeight: number;
  height: number;
  activityLevel: string;
  fitnessExperience: string;
  medicalConditions?: string | null;
}

export interface ClientGoal {
  id: string;
  goalType: string[];
  targetWeight?: number | null;
  targetDate?: Date | null;
  calorieTarget?: number | null;
  proteinTarget?: number | null;
  carbTarget?: number | null;
  fatTarget?: number | null;
  isActive: boolean;
}
