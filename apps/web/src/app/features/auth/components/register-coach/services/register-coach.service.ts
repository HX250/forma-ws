import { Injectable } from '@angular/core';
import {
  SpecializationField,
  CommunicationMethod,
  Gender,
} from '@forma-ws/frontend/domain';

export interface SelectFieldType<T> {
  value: T;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterCoachService {
  getGenderFields(): SelectFieldType<Gender>[] {
    return [
      { value: Gender.MALE, label: 'AUTH.REGISTER_COACH.GENDER_OPTIONS.MALE' },
      { value: Gender.FEMALE, label: 'AUTH.REGISTER_COACH.GENDER_OPTIONS.FEMALE' },
      { value: Gender.OTHER, label: 'AUTH.REGISTER_COACH.GENDER_OPTIONS.OTHER' },
      { value: Gender.PREFER_NOT_TO_SAY, label: 'AUTH.REGISTER_COACH.GENDER_OPTIONS.PREFER_NOT_TO_SAY' },
    ];
  }

  getSpecializationFields(): SelectFieldType<SpecializationField>[] {
    return [
      { value: SpecializationField.POWERLIFTING, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.POWERLIFTING' },
      { value: SpecializationField.CROSSFIT, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.CROSSFIT' },
      { value: SpecializationField.BODYBUILDING, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.BODYBUILDING' },
      { value: SpecializationField.WEIGHT_LOSS, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.WEIGHT_LOSS' },
      {
        value: SpecializationField.STRENGTH_TRAINING,
        label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.STRENGTH_TRAINING',
      },
      { value: SpecializationField.CARDIO, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.CARDIO' },
      { value: SpecializationField.YOGA, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.YOGA' },
      { value: SpecializationField.PILATES, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.PILATES' },
      {
        value: SpecializationField.SPORTS_PERFORMANCE,
        label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.SPORTS_PERFORMANCE',
      },
      { value: SpecializationField.REHABILITATION, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.REHABILITATION' },
      { value: SpecializationField.NUTRITION, label: 'AUTH.REGISTER_COACH.SPECIALIZATION_FIELDS_OPTIONS.NUTRITION' },
    ];
  }

  getCommunicationMethodFields(): SelectFieldType<CommunicationMethod>[] {
    return [
      { value: CommunicationMethod.EMAIL, label: 'AUTH.REGISTER_COACH.COMMUNICATION_METHODS_OPTIONS.EMAIL' },
      { value: CommunicationMethod.PHONE, label: 'AUTH.REGISTER_COACH.COMMUNICATION_METHODS_OPTIONS.PHONE' },
      { value: CommunicationMethod.TEXT_MESSAGE, label: 'AUTH.REGISTER_COACH.COMMUNICATION_METHODS_OPTIONS.TEXT_MESSAGE' },
      {
        value: CommunicationMethod.IN_APP_MESSAGING,
        label: 'AUTH.REGISTER_COACH.COMMUNICATION_METHODS_OPTIONS.IN_APP_MESSAGING',
      },
    ];
  }
}
