import { Gender, ActivityLevel, FitnessExperience } from '../../enums';

export interface Client {
  id: string;
  email: string;
  isFirstLogin: boolean;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: Date;
  currentWeight: number;
  height: number;
  activityLevel: ActivityLevel;
  medicalConditions?: string;
  fitnessExperience: FitnessExperience;
  coachId: string;
  canTrackExercise: boolean;
  canTrackSleep: boolean;
  canTrackNutrition: boolean;
  canTrackWater: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientTable {
  id: string;
  firstName: string;
  lastName: string;
  canTrackExercise: boolean;
  canTrackSleep: boolean;
  canTrackNutrition: boolean;
  canTrackWater: boolean;
}
