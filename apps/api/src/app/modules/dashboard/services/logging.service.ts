import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { ActivityEnum, LoggingDto } from '@forma-ws/domain';

@Injectable()
export class LoggingService {
  constructor(private readonly prisma: DatabaseService) {}

  async getLoggingActivity(coachId: string): Promise<LoggingDto[]> {
    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const clients = await this.prisma.client.findMany({
      where: { coachId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (clients.length === 0) return [];

    const clientIds = clients.map((c) => c.id);
    const clientMap = new Map(
      clients.map((c) => [
        c.id,
        { firstName: c.firstName, lastName: c.lastName },
      ])
    );

    const where = { clientId: { in: clientIds }, createdAt: { gte: since } };
    const select = { clientId: true, createdAt: true };

    const [exercise, nutrition, sleep, water, weighIn] = await Promise.all([
      this.prisma.exerciseEntry.findMany({ where, select }),
      this.prisma.nutritionEntry.findMany({ where, select }),
      this.prisma.sleepEntry.findMany({ where, select }),
      this.prisma.waterEntry.findMany({ where, select }),
      this.prisma.weighIn.findMany({ where, select }),
    ]);

    const toDto = (
      entries: { clientId: string; createdAt: Date }[],
      type: ActivityEnum
    ): LoggingDto[] =>
      entries.map((e) => ({
        client: clientMap.get(e.clientId)!,
        activityType: type,
        timestamp: e.createdAt,
      }));

    const all: LoggingDto[] = [
      ...toDto(exercise, ActivityEnum.WORKOUT),
      ...toDto(nutrition, ActivityEnum.NUTRITION),
      ...toDto(sleep, ActivityEnum.SLEEP),
      ...toDto(water, ActivityEnum.WATER),
      ...toDto(weighIn, ActivityEnum.WEIGH_IN),
    ];

    return all.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
