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

export interface CoachSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date;
  currentWeight: number;
  height: number;
  activityLevel: string;
  fitnessExperience: string;
  medicalConditions?: string | null;
  canTrackExercise: boolean;
  canTrackSleep: boolean;
  canTrackNutrition: boolean;
  canTrackWater: boolean;
  coachId: string;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
  coach?: CoachSummary;
  goals?: ClientGoal | null;
}

export interface ClientTable {
  id: string;
  firstName: string;
  lastName: string;
  canTrackExercise: boolean;
  canTrackSleep: boolean;
  canTrackNutrition: boolean;
  canTrackWater: boolean;
  updatedAt: Date;
}

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

export interface ClientHealthDetails {
  currentWeight: number;
  height: number;
  activityLevel: string;
  fitnessExperience: string;
  medicalConditions?: string | null;
}
