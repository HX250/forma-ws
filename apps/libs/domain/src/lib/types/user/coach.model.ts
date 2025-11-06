import { Gender, SpecializationField, CommunicationMethod } from '../../enums';

export interface Coach {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  yearsOfExperience: number;
  specializationFields: SpecializationField[];
  bio?: string;
  pricing?: number;
  availability?: Record<string, unknown>;
  communicationMethods: CommunicationMethod[];
  createdAt: Date;
  updatedAt: Date;
}
