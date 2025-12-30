import {
  IsDateString,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AddSleepEntryDto {
  @IsString()
  clientId!: string;

  @IsDateString()
  bedTime!: string;

  @IsDateString()
  wakeTime!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  sleepQuality?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class GetSleepEntryDto {
  @IsString()
  clientId!: string;

  @IsISO8601()
  createdAt!: string;
}

export class DeleteSleepEntryDto {
  @IsString()
  id!: string;

  @IsString()
  clientId!: string;
}
