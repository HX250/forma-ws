import * as bcrypt from 'bcrypt';
import { UserType } from '@forma-ws/types';
import { AuthPayload } from '@forma-ws/types';
import { Gender, ActivityLevel, FitnessExperience } from '@prisma/client';

export class Client {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly coachId: string,
    private passwordHash: string | null,
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
    public readonly updatedAt: Date = new Date()
  ) {}

  async validatePassword(plainPassword: string): Promise<boolean> {
    if (this.isFirstLogin && this.oneTimePassword) {
      return plainPassword === this.oneTimePassword;
    }

    if (!this.passwordHash) {
      throw new Error('Client has no permanent password set');
    }

    return await bcrypt.compare(plainPassword, this.passwordHash);
  }

  async setPermamentPassword(plainPassword: string): Promise<void> {
    if (!this.isFirstLogin) {
      throw new Error('Client already has permanent password');
    }

    this.passwordHash = await bcrypt.hash(plainPassword, 12);
    this.oneTimePassword = null;
  }

  static async createWithOneTimePassword(
    id: string,
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
  ): Promise<Client> {
    return new Client(
      id,
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
    return this.passwordHash;
  }

  getOneTimePassword(): string | null {
    return this.oneTimePassword;
  }
}
