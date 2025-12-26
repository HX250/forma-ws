import { ClientGoal } from './tracking/client-response-tracking.dto';

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
