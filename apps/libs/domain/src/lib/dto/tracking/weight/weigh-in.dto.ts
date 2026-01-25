import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddWeighInDto {
  @IsNumber()
  weight!: number;

  @IsNumber()
  @IsOptional()
  bodyFatPercentage?: number;

  @IsNumber()
  @IsOptional()
  muscleMass?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
