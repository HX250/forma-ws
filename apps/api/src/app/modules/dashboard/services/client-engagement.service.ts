import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { ClientEngagementResponse } from '@forma-ws/domain';

@Injectable()
export class ClientEngagementService {
  constructor(private readonly prisma: DatabaseService) {}

  async getClientEngagement(
    coachId: string
  ): Promise<ClientEngagementResponse> {
    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const clients = await this.prisma.client.findMany({
      where: { coachId },
      select: { id: true },
    });

    const total = clients.length;

    if (total === 0) {
      return {
        workoutEngagement: 0,
        nutritionEngagement: 0,
        sleepEngagement: 0,
        waterEngagement: 0,
      };
    }

    const clientIds = clients.map((c) => c.id);

    const [exercise, nutrition, sleep, water] = await Promise.all([
      this.prisma.exerciseEntry.findMany({
        where: { clientId: { in: clientIds }, createdAt: { gte: since } },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
      this.prisma.nutritionEntry.findMany({
        where: { clientId: { in: clientIds }, createdAt: { gte: since } },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
      this.prisma.sleepEntry.findMany({
        where: { clientId: { in: clientIds }, createdAt: { gte: since } },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
      this.prisma.waterEntry.findMany({
        where: { clientId: { in: clientIds }, createdAt: { gte: since } },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
    ]);

    const toPercent = (count: number) =>
      Math.round((count / total) * 100 * 100) / 100;

    return {
      workoutEngagement: toPercent(exercise.length),
      nutritionEngagement: toPercent(nutrition.length),
      sleepEngagement: toPercent(sleep.length),
      waterEngagement: toPercent(water.length),
    };
  }
}
