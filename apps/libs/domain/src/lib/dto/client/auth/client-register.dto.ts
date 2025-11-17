import {
  Gender,
  ActivityLevel,
  FitnessExperience,
} from '@forma-ws/frontend/domain';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';

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
