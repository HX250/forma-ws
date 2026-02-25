import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { GoalType, WeightTrendDto } from '@forma-ws/domain';

@Injectable()
export class WeightTrendService {
  constructor(private readonly prisma: DatabaseService) {}

  async getWeightTrend(coachId: string): Promise<WeightTrendDto> {
    const clients = await this.prisma.client.findMany({
      where: { coachId },
      select: {
        id: true,
        goals: {
          select: { goalType: true },
        },
        weighIns: {
          select: { weight: true, date: true },
          orderBy: { date: 'desc' },
          take: 2,
        },
      },
    });

    const total = clients.length;

    if (total === 0) {
      return { weightTrend: 0 };
    }

    let onTrack = 0;

    for (const client of clients) {
      const goalTypes = client.goals?.goalType ?? [];
      const weighIns = client.weighIns;

      if (weighIns.length < 2) continue;

      const latest = Number(weighIns[0].weight);
      const previous = Number(weighIns[1].weight);
      const diff = latest - previous;

      const isLosing = goalTypes.includes(GoalType.LOSE_WEIGHT);
      const isGaining =
        goalTypes.includes(GoalType.GAIN_WEIGHT) ||
        goalTypes.includes(GoalType.BUILD_MUSCLE);
      const isMaintaining = goalTypes.includes(GoalType.MAINTAIN_WEIGHT);

      if (isLosing && diff < 0) onTrack++;
      else if (isGaining && diff > 0) onTrack++;
      else if (isMaintaining && Math.abs(diff) <= 0.5) onTrack++;
      else if (!isLosing && !isGaining && !isMaintaining) onTrack++;
    }

    const weightTrend = Math.round((onTrack / total) * 100 * 100) / 100;

    return { weightTrend };
  }
}
