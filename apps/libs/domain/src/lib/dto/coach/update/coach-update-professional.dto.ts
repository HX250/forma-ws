import { SpecializationField } from '@forma-ws/frontend/domain';
import {
  IsString,
  IsEnum,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateCoachProfessionalDto {
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
}
