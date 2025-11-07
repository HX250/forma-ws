import { Injectable } from '@angular/core';
import {
  Gender,
  ActivityLevel,
  FitnessExperience,
} from '@forma-ws/frontend/domain';

export interface SelectFieldType<T> {
  value: T;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterClientService {
  getGenderFields(): SelectFieldType<Gender>[] {
    return [
      { value: Gender.MALE, label: 'REGISTER_CLIENT.GENDER_OPTIONS.MALE' },
      { value: Gender.FEMALE, label: 'REGISTER_CLIENT.GENDER_OPTIONS.FEMALE' },
      { value: Gender.OTHER, label: 'REGISTER_CLIENT.GENDER_OPTIONS.OTHER' },
      { value: Gender.PREFER_NOT_TO_SAY, label: 'REGISTER_CLIENT.GENDER_OPTIONS.PREFER_NOT_TO_SAY' },
    ];
  }

  getActivityLevelFields(): SelectFieldType<ActivityLevel>[] {
    return [
      { value: ActivityLevel.SEDENTARY, label: 'REGISTER_CLIENT.ACTIVITY_LEVEL_OPTIONS.SEDENTARY' },
      { value: ActivityLevel.LIGHTLY_ACTIVE, label: 'REGISTER_CLIENT.ACTIVITY_LEVEL_OPTIONS.LIGHTLY_ACTIVE' },
      { value: ActivityLevel.MODERATELY_ACTIVE, label: 'REGISTER_CLIENT.ACTIVITY_LEVEL_OPTIONS.MODERATELY_ACTIVE' },
      { value: ActivityLevel.VERY_ACTIVE, label: 'REGISTER_CLIENT.ACTIVITY_LEVEL_OPTIONS.VERY_ACTIVE' },
      { value: ActivityLevel.EXTREMELY_ACTIVE, label: 'REGISTER_CLIENT.ACTIVITY_LEVEL_OPTIONS.EXTREMELY_ACTIVE' },
    ];
  }

  getFitnessExperienceFields(): SelectFieldType<FitnessExperience>[] {
    return [
      { value: FitnessExperience.BEGINNER, label: 'REGISTER_CLIENT.FITNESS_EXPERIENCE_OPTIONS.BEGINNER' },
      { value: FitnessExperience.INTERMEDIATE, label: 'REGISTER_CLIENT.FITNESS_EXPERIENCE_OPTIONS.INTERMEDIATE' },
      { value: FitnessExperience.ADVANCED, label: 'REGISTER_CLIENT.FITNESS_EXPERIENCE_OPTIONS.ADVANCED' },
      { value: FitnessExperience.EXPERT, label: 'REGISTER_CLIENT.FITNESS_EXPERIENCE_OPTIONS.EXPERT' },
    ];
  }
}
