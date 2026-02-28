import { FormControl } from '@angular/forms';
import {
  AvailabilityModel,
  CommunicationMethod,
  Gender,
  SpecializationField,
} from '@forma-ws/frontend/domain';

export namespace CoachSettingsModel {
  export namespace Form {
    export interface Personal {
      firstName: FormControl<string>;
      lastName: FormControl<string>;
      gender: FormControl<Gender>;
    }

    export interface Professional {
      yearsOfExperience: FormControl<number>;
      specializationFields: FormControl<SpecializationField[]>;
      bio: FormControl<string>;
      pricing: FormControl<number>;
    }

    export interface Availability {
      availability: FormControl<AvailabilityModel[]>;
      communicationMethods: FormControl<CommunicationMethod[]>;
    }
  }
}
