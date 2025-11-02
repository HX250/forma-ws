import { FormControl } from '@angular/forms';
import {
  CommunicationMethod,
  Gender,
  SpecializationField,
  UserType,
} from '@forma-ws/frontend/domain';

export namespace AuthModel {
  export namespace Form {
    export interface Login {
      email: FormControl<string>;
      password: FormControl<string>;
      userType: FormControl<UserType>;
    }

    export interface registerCoach {
      email: FormControl<string>;
      password: FormControl<string>;
      firstName: FormControl<string>;
      lastName: FormControl<string>;
      gender: FormControl<Gender>;
      yearsOfExperience: FormControl<number>;
      specializationFields: FormControl<SpecializationField[]>;
      certificates: FormControl<string[]>;
      bio: FormControl<string>;
      pricing: FormControl<number>;
      availability: FormControl<string>;
      timezone: FormControl<string>;
      communicationMethods: FormControl<CommunicationMethod[]>;
    }
  }
}
