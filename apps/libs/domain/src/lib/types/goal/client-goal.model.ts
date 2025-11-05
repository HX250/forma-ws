import { GoalType } from '../../enums';

export interface ClientGoal {
  id: string;
  clientId: string;
  goalType: GoalType[];
  targetWeight?: number;
  targetDate?: Date;
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
