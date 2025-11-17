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
  availability?: any | null;
  communicationMethods: string[];
  createdAt: Date;
  updatedAt: Date;
}
