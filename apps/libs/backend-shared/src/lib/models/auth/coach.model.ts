import * as bcrypt from 'bcrypt';
import {
  Gender,
  SpecializationField,
  CommunicationMethod,
  RegisterCoachDto,
  AuthPayload,
  UserType,
  AvailabilityModel,
} from '@forma-ws/domain';
import { Prisma } from '@prisma/client';

export class Coach {
  constructor(
    public readonly email: string,
    private password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly yearsOfExperience: number,
    public readonly specializationFields: SpecializationField[],
    public readonly communicationMethods: CommunicationMethod[],
    public readonly bio?: string,
    public readonly pricing?: number,
    public readonly availability?: AvailabilityModel[],
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
      coach.communicationMethods || [],
      coach.bio,
      coach.pricing,
      coach.availability
    );
  }

  getUserType(): UserType {
    return UserType.COACH;
  }

  getAuthPayload(): AuthPayload {
    return {
      sub: this.id!,
      email: this.email,
      userType: this.getUserType(),
    };
  }

  static fromPrisma(data: any): Coach {
    return new Coach(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.gender,
      data.yearsOfExperience,
      data.specializationFields,
      data.communicationMethods,
      data.bio,
      data.pricing?.toNumber(),
      data.availability as AvailabilityModel[],
      data.createdAt,
      data.updatedAt,
      data.id
    );
  }

  toPrisma() {
    return {
      ...this,
      password: this.password,
      availability: this.availability as unknown as Prisma.InputJsonValue,
    } as Prisma.CoachCreateInput;
  }

  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }
}
