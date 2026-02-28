import {
  Gender,
  SpecializationField,
  CommunicationMethod,
} from '@forma-ws/frontend/domain';
import { AvailabilityModel } from './auth/coach-register.dto';

export interface Coach {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  yearsOfExperience: number;
  specializationFields: string[];
  bio?: string | null;
  pricing?: number | null;
  availability?: AvailabilityModel[] | null;
  communicationMethods: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CoachPersonalProfile {
  firstName: string;
  lastName: string;
  gender: Gender;
}

export interface CoachProfessionalProfile {
  yearsOfExperience: number;
  specializationFields: SpecializationField[];
  bio?: string | null;
  pricing?: number | null;
}

export interface CoachAvailabilityProfile {
  availability?: AvailabilityModel[] | null;
  communicationMethods: CommunicationMethod[];
}
