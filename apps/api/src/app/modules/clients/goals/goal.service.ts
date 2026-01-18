import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  decimalToNumber,
  prismaToPlain,
} from '@forma-ws/backend-shared';
import { ClientGoalDto, ClientGoalResponse } from '@forma-ws/domain';
import { ClientGoal } from '@prisma/client';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: DatabaseService) {}

  async getClientTrackingGoals(
    clientId: string
  ): Promise<ClientGoalResponse | null> {
    const goal = await this.prisma.clientGoal.findUnique({
      where: { clientId },
    });

    if (!goal) return null;

    return this.mapGoalToResponse(goal);
  }

  async createOrUpdateGoal(
    clientId: string,
    dto: ClientGoalDto
  ): Promise<boolean> {
    const existingGoal = await this.prisma.clientGoal.findUnique({
      where: { clientId },
    });

    const goalData = {
      goalType: dto.goalType,
      targetWeight: dto.targetWeight,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      caloriesGoal: dto.caloriesGoal,
      proteinTarget: dto.proteinTarget,
      carbTarget: dto.carbTarget,
      fatTarget: dto.fatTarget,
      fiberTarget: dto.fiberTarget,
      sugarTarget: dto.sugarTarget,
      sleepGoal: dto.sleepGoal,
      waterGoal: dto.waterGoal,
      weightGoal: dto.weightGoal,
      exerciseGoal: dto.exerciseGoal,
    };

    await this.prisma.clientGoal.upsert({
      where: { clientId },
      update: goalData,
      create: {
        clientId,
        ...goalData,
      },
    });

    return true;
  }

  private mapGoalToResponse(goal: ClientGoal): ClientGoalResponse {
    return prismaToPlain<ClientGoalResponse>({
      generalGoals: {
        goalType: goal.goalType,
        weightGoal: decimalToNumber(goal.weightGoal),
        targetWeight: decimalToNumber(goal.targetWeight),
        targetDate: new Date(goal.targetDate),
      },
      trackingGoal: {
        nutritionGoals: {
          caloriesGoal: goal.caloriesGoal,
          proteinTarget: decimalToNumber(goal.proteinTarget),
          carbTarget: decimalToNumber(goal.carbTarget),
          fatTarget: decimalToNumber(goal.fatTarget),
          fiberTarget: decimalToNumber(goal.fiberTarget),
          sugarTarget: decimalToNumber(goal.sugarTarget),
        },
        sleepGoal: decimalToNumber(goal.sleepGoal),
        waterGoal: decimalToNumber(goal.waterGoal),
        exerciseGoal: decimalToNumber(goal.exerciseGoal),
      },
    });
  }
}
