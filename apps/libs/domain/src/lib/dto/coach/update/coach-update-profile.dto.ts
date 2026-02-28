import {
  Gender,
  SpecializationField,
  CommunicationMethod,
} from '@forma-ws/frontend/domain';
import {
  IsString,
  IsEnum,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';
import { AvailabilityModel } from '../auth/coach-register.dto';

export class UpdateCoachProfileDto {
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
  communicationMethods!: CommunicationMethod[];
}
