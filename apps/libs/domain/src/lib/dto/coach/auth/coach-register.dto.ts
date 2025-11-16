import {
  Gender,
  SpecializationField,
  CommunicationMethod,
  DaysEnum,
} from '@forma-ws/frontend/domain';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';

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

export interface AvailabilityModel {
  day: DaysEnum;
  enabled: boolean;
  time: BetweenTimeModel[];
}

export interface BetweenTimeModel {
  from: string;
  to: string;
}
