import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  Min,
  IsBoolean,
} from 'class-validator';
import {
  Gender,
  ActivityLevel,
  FitnessExperience,
  SpecializationField,
  CommunicationMethod,
  DaysEnum,
} from '../../enums';
import { UserType } from '../../auth';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(UserType)
  userType!: UserType;
}

export class RegisterCoachDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsNumber()
  @Min(0)
  yearsOfExperience!: number;

  @IsArray()
  @IsEnum(SpecializationField, { each: true })
  specializationFields!: SpecializationField[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsNumber()
  @Min(0)
  pricing!: number;

  @IsOptional()
  availability?: AvailabilityModel[];

  @IsArray()
  @IsEnum(CommunicationMethod, { each: true })
  communicationMethods: CommunicationMethod[] = [];
}

export class RegisterClientDto {
  @IsEmail()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsDateString()
  birthDate!: string;

  @IsNumber()
  @Min(0)
  currentWeight!: number;

  @IsNumber()
  @Min(0)
  height!: number;

  @IsEnum(ActivityLevel)
  activityLevel!: ActivityLevel;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsEnum(FitnessExperience)
  fitnessExperience!: FitnessExperience;

  @IsString()
  coachId!: string;

  @IsBoolean()
  canTrackExercise!: boolean;

  @IsBoolean()
  canTrackSleep!: boolean;

  @IsBoolean()
  canTrackNutrition!: boolean;

  @IsBoolean()
  canTrackWater!: boolean;
}

export class SetClientPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

export interface AvailabilityModel {
  day: DaysEnum;
  enabled: boolean;
  time: BetweenTimeModel[];
}

export interface BetweenTimeModel {
  from: string;
  to: string;
}
