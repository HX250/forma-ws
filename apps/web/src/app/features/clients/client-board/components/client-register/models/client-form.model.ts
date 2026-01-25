import { FormControl } from '@angular/forms';
import { Gender, ActivityLevel, FitnessExperience } from '@forma-ws/domain';

export interface ClientFormControls {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  gender: FormControl<Gender>;
  birthDate: FormControl<Date>;
  currentWeight: FormControl<number>;
  height: FormControl<number>;
  activityLevel: FormControl<ActivityLevel>;
  medicalConditions: FormControl<string>;
  fitnessExperience: FormControl<FitnessExperience>;
  coachId: FormControl<string>;
  canTrackExercise: FormControl<boolean>;
  canTrackSleep: FormControl<boolean>;
  canTrackNutrition: FormControl<boolean>;
  canTrackWater: FormControl<boolean>;
}
