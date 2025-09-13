import * as bcrypt from 'bcrypt';
import { AuthPayload, UserType } from '@forma-ws/types';
import {
  Gender,
  SpecializationField,
  CommunicationMethod,
} from '@forma-ws/domain';
import { RegisterCoachDto } from '@forma-ws/shared';

export class Coach {
  constructor(
    public readonly email: string,
    private password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly yearsOfExperience: number,
    public readonly specializationFields: SpecializationField[],
    public readonly certificates: string[],
    public readonly communicationMethods: CommunicationMethod[],
    public readonly profilePhoto?: string,
    public readonly bio?: string,
    public readonly pricing?: number,
    public readonly availability?: string,
    public readonly timezone?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly id?: string
  ) {}

  async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }

  static async createWithHashedPassword(
    coach: RegisterCoachDto
  ): Promise<Coach> {
    return new Coach(
      coach.email,
      await bcrypt.hash(coach.password, 12),
      coach.firstName,
      coach.lastName,
      coach.gender,
      coach.yearsOfExperience,
      coach.specializationFields,
      coach.certificates || [],
      coach.communicationMethods || [],
      coach.profilePhoto,
      coach.bio,
      coach.pricing,
      coach.availability,
      coach.timezone
    );
  }

  getUserType(): UserType {
    return UserType.COACH;
  }

  getAuthPayload(): AuthPayload {
    return {
      sub: this.id,
      email: this.email,
      userType: this.getUserType(),
    };
  }

  toPrisma(): {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    yearsOfExperience: number;
    specializationFields: SpecializationField[];
    certificates: string[];
    profilePhoto?: string;
    bio?: string;
    pricing?: number;
    availability?: string;
    timezone?: string;
    communicationMethods: CommunicationMethod[];
  } {
    return {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      yearsOfExperience: this.yearsOfExperience,
      specializationFields: this.specializationFields,
      certificates: this.certificates,
      profilePhoto: this.profilePhoto,
      bio: this.bio,
      pricing: this.pricing,
      availability: this.availability,
      timezone: this.timezone,
      communicationMethods: this.communicationMethods,
    };
  }
}
