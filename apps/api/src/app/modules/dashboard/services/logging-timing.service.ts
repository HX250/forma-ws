import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { LoggingTimingResponse } from '@forma-ws/domain';

type TimeBucket = 'morning' | 'lunch' | 'afternoon' | 'night';

@Injectable()
export class LoggingTimingService {
  constructor(private readonly prisma: DatabaseService) {}

  async getLoggingTiming(coachId: string): Promise<LoggingTimingResponse> {
    const since = new Date();
    since.setHours(0, 0, 0, 0);

    const clients = await this.prisma.client.findMany({
      where: { coachId },
      select: { id: true },
    });

    const total = clients.length;

    if (total === 0) {
      return {
        morningTiming: 0,
        lunchTiming: 0,
        afternoonTiming: 0,
        nightTiming: 0,
      };
    }

    const clientIds = clients.map((c) => c.id);
    const where = { clientId: { in: clientIds }, createdAt: { gte: since } };
    const select = { clientId: true, createdAt: true };

    const [exercise, nutrition, sleep, water] = await Promise.all([
      this.prisma.exerciseEntry.findMany({ where, select }),
      this.prisma.nutritionEntry.findMany({ where, select }),
      this.prisma.sleepEntry.findMany({ where, select }),
      this.prisma.waterEntry.findMany({ where, select }),
    ]);

    const buckets: Record<TimeBucket, Set<string>> = {
      morning: new Set(),
      lunch: new Set(),
      afternoon: new Set(),
      night: new Set(),
    };

    const toBucket = (date: Date): TimeBucket => {
      const hour = date.getHours();
      if (hour >= 5 && hour < 11) return 'morning';
      if (hour >= 11 && hour < 16) return 'lunch';
      if (hour >= 16 && hour < 20) return 'afternoon';
      return 'night';
    };

    for (const entry of [...exercise, ...nutrition, ...sleep, ...water]) {
      buckets[toBucket(new Date(entry.createdAt))].add(entry.clientId);
    }

    const toPercent = (count: number) =>
      Math.round((count / total) * 100 * 100) / 100;

    return {
      morningTiming: toPercent(buckets.morning.size),
      lunchTiming: toPercent(buckets.lunch.size),
      afternoonTiming: toPercent(buckets.afternoon.size),
      nightTiming: toPercent(buckets.night.size),
    };
  }
}
