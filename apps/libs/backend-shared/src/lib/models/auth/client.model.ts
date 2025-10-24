import * as bcrypt from 'bcryptjs';
import {
  UserType,
  AuthPayload,
  Gender,
  ActivityLevel,
  FitnessExperience,
} from '@forma-ws/domain';

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

  toPrisma(): {
    email: string;
    coachId: string;
    password: string | null;
    oneTimePassword: string | null;
    isFirstLogin: boolean;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthDate: Date;
    currentWeight: number;
    height: number;
    activityLevel: ActivityLevel;
    fitnessExperience: FitnessExperience;
    canTrackExercise: boolean;
    canTrackSleep: boolean;
    canTrackNutrition: boolean;
    canTrackWater: boolean;
    medicalConditions?: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      email: this.email,
      coachId: this.coachId,
      password: this.password,
      oneTimePassword: this.oneTimePassword,
      isFirstLogin: this.isFirstLogin,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      birthDate: this.birthDate,
      currentWeight: this.currentWeight,
      height: this.height,
      activityLevel: this.activityLevel,
      fitnessExperience: this.fitnessExperience,
      canTrackExercise: this.canTrackExercise,
      canTrackSleep: this.canTrackSleep,
      canTrackNutrition: this.canTrackNutrition,
      canTrackWater: this.canTrackWater,
      medicalConditions: this.medicalConditions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getUserType(): UserType {
    return UserType.CLIENT;
  }

  getAuthPayload(): AuthPayload {
    return {
      sub: this.id,
      email: this.email,
      userType: this.getUserType(),
      coachId: this.coachId,
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
