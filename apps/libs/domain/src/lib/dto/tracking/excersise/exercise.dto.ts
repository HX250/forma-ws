import { IsNumber, IsString } from 'class-validator';

export class ExerciseEntryDto {
  @IsString()
  exerciseId!: string;

  @IsString()
  exerciseName!: string;

  @IsString()
  exerciseNameSk!: string;

  @IsNumber()
  sets!: number;

  @IsNumber()
  reps!: number;

  @IsNumber()
  weight!: number;

  @IsNumber()
  duration!: number;

  @IsString()
  notes!: string;
}
