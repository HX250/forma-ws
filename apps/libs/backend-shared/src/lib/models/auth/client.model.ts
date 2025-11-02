import * as bcrypt from 'bcrypt';
import {
  UserType,
  AuthPayload,
  Gender,
  ActivityLevel,
  FitnessExperience,
} from '@forma-ws/domain';
import { Prisma } from '@prisma/client';

export class Client {
  constructor(
    public readonly email: string,
    public readonly coachId: string,
    private password: string | null,
    private oneTimePassword: string | null,
    public readonly isFirstLogin: boolean,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly birthDate: Date,
    public readonly currentWeight: number,
    public readonly height: number,
    public readonly activityLevel: ActivityLevel,
    public readonly fitnessExperience: FitnessExperience,
    public readonly canTrackExercise: boolean,
    public readonly canTrackSleep: boolean,
    public readonly canTrackNutrition: boolean,
    public readonly canTrackWater: boolean,
    public readonly medicalConditions?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly id?: string
  ) {}

  async validatePassword(plainPassword: string): Promise<boolean> {
    if (this.isFirstLogin && this.oneTimePassword) {
      return plainPassword === this.oneTimePassword;
    }
    if (!this.password) {
      throw new Error('Client has no permanent password set');
    }
    return await bcrypt.compare(plainPassword, this.password);
  }

  async setPermamentPassword(plainPassword: string): Promise<void> {
    if (!this.isFirstLogin) {
      throw new Error('Client already has permanent password');
    }

    this.password = await bcrypt.hash(plainPassword, 12);
    this.oneTimePassword = null;
  }

  static createWithOneTimePassword(
    email: string,
    coachId: string,
    firstName: string,
    lastName: string,
    gender: Gender,
    birthDate: Date,
    currentWeight: number,
    height: number,
    activityLevel: ActivityLevel,
    medicalConditions: string | undefined,
    fitnessExperience: FitnessExperience,
    oneTimePassword: string
  ): Client {
    return new Client(
      email,
      coachId,
      null,
      oneTimePassword,
      true,
      firstName,
      lastName,
      gender,
      birthDate,
      currentWeight,
      height,
      activityLevel,
      fitnessExperience,
      false,
      false,
      false,
      false,
      medicalConditions
    );
  }

  static fromPrisma(data: any): Client {
    return new Client(
      data.email,
      data.coachId,
      data.password,
      data.oneTimePassword,
      data.isFirstLogin,
      data.firstName,
      data.lastName,
      data.gender,
      data.birthDate,
      data.currentWeight.toNumber(),
      data.height.toNumber(),
      data.activityLevel,
      data.fitnessExperience,
      data.canTrackExercise,
      data.canTrackSleep,
      data.canTrackNutrition,
      data.canTrackWater,
      data.medicalConditions,
      data.createdAt,
      data.updatedAt,
      data.id
    );
  }

  toPrisma() {
    return {
      ...this,
      password: this.password,
      oneTimePassword: this.oneTimePassword,
    } as Prisma.ClientCreateInput;
  }

  getUserType(): UserType {
    return UserType.CLIENT;
  }

  getAuthPayload(): AuthPayload {
    return {
      sub: this.id!,
      email: this.email,
      userType: this.getUserType(),
    };
  }

  needsPasswordSetup(): boolean {
    return this.isFirstLogin && !!this.oneTimePassword;
  }

  getPasswordHash(): string | null {
    return this.password;
  }

  getOneTimePassword(): string | null {
    return this.oneTimePassword;
  }
}
