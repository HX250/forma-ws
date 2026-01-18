import { DatabaseService } from '@forma-ws/backend-shared';
import { ChartSpaceVlues } from '@forma-ws/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeightService {
  constructor(private prisma: DatabaseService) {}

  async getWeightTracking(clientId: string, span: ChartSpaceVlues) {
    const endDate = new Date();
    const startDate = this.getStartDate(span, endDate);

    if (span === ChartSpaceVlues.DAY) {
      return this.getDailyWeights(clientId, startDate, endDate);
    }

    return this.getMonthlyAverages(clientId, startDate, endDate);
  }

  private getStartDate(span: ChartSpaceVlues, end: Date): Date {
    const start = new Date(end);

    if (span === ChartSpaceVlues.DAY) {
      start.setDate(end.getDate() - 6);
      return start;
    }

    start.setMonth(end.getMonth() - span);
    return start;
  }

  private async getDailyWeights(clientId: string, start: Date, end: Date) {
    const weighIns = await this.prisma.weighIn.findMany({
      where: {
        clientId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    });

    const map = new Map<string, number>();

    weighIns.forEach((w) =>
      map.set(w.date.toISOString().slice(0, 10), Number(w.weight))
    );

    const result: number[] = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      result.push(map.get(key) ?? null);
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      span: ChartSpaceVlues.DAY,
      data: result,
    };
  }

  private async getMonthlyAverages(clientId: string, start: Date, end: Date) {
    // fetch all weigh-ins for the period
    const weighIns = await this.prisma.weighIn.findMany({
      where: {
        clientId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    });

    const monthMap = new Map<string, number[]>();

    weighIns.forEach((w) => {
      const monthKey = `${w.date.getFullYear()}-${w.date.getMonth() + 1}`; // e.g. "2026-1"
      if (!monthMap.has(monthKey)) monthMap.set(monthKey, []);
      monthMap.get(monthKey)!.push(Number(w.weight));
    });

    const months: string[] = [];
    const temp = new Date(start);
    while (temp <= end) {
      months.push(`${temp.getFullYear()}-${temp.getMonth() + 1}`);
      temp.setMonth(temp.getMonth() + 1);
    }

    const data = months.map((m) => {
      const values = monthMap.get(m);
      if (!values || values.length === 0) return null;
      const sum = values.reduce((acc, cur) => acc + cur, 0);
      return sum / values.length;
    });

    return {
      span: 'MONTH',
      data,
    };
  }
}
