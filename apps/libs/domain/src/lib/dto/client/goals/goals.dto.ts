import { GoalType } from '@forma-ws/frontend/domain';
import { IsArray, IsEnum, IsISO8601, IsNumber } from 'class-validator';

export class ClientGoalDto {
  @IsArray()
  @IsEnum(GoalType, { each: true })
  goalType!: GoalType[];

  @IsNumber()
  targetWeight?: number;

  @IsISO8601()
  targetDate?: string;

  @IsNumber()
  caloriesGoal?: number;

  @IsNumber()
  proteinTarget?: number;

  @IsNumber()
  carbTarget?: number;

  @IsNumber()
  fatTarget?: number;

  @IsNumber()
  fiberTarget?: number;

  @IsNumber()
  sugarTarget?: number;

  @IsNumber()
  sleepGoal?: number;

  @IsNumber()
  waterGoal?: number;

  @IsNumber()
  weightGoal?: number;

  @IsNumber()
  exerciseGoal?: number;
}
