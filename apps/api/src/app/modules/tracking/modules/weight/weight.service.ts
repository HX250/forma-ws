import { DatabaseService, prismaToPlain } from '@forma-ws/backend-shared';
import {
  AddWeighInDto,
  ChartSpaceValues,
  WeighInResponse,
  WeightTrackingResponse,
} from '@forma-ws/domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeightService {
  constructor(private prisma: DatabaseService) {}

  async logDailyWeighIn(
    clientId: string,
    dto: AddWeighInDto
  ): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.prisma.$transaction([
      this.prisma.weighIn.upsert({
        where: {
          clientId_date: {
            clientId,
            date: today,
          },
        },
        update: {
          weight: dto.weight,
          bodyFatPercentage: dto.bodyFatPercentage,
          muscleMass: dto.muscleMass,
          notes: dto.notes,
        },
        create: {
          clientId,
          date: today,
          weight: dto.weight,
          bodyFatPercentage: dto.bodyFatPercentage,
          muscleMass: dto.muscleMass,
          notes: dto.notes,
        },
      }),
      this.prisma.client.update({
        where: { id: clientId },
        data: { currentWeight: dto.weight },
      }),
    ]);

    return true;
  }

  async getTodayWeighIn(clientId: string): Promise<WeighInResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await this.prisma.weighIn.findFirst({
      where: {
        clientId: clientId,
        date: today,
      },
      select: {
        id: true,
        weight: true,
        bodyFatPercentage: true,
        muscleMass: true,
        notes: true,
        createdAt: true,
      },
    });

    return prismaToPlain<WeighInResponse>(data);
  }

  async getWeightTracking(
    clientId: string,
    span: ChartSpaceValues
  ): Promise<WeightTrackingResponse> {
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const startDate = this.getStartDate(span, endDate);

    if (span === ChartSpaceValues.DAY) {
      return this.getWeeklyWeights(clientId, startDate, endDate);
    }

    return this.getMonthlyAverages(clientId, startDate, endDate, span);
  }

  private getStartDate(span: ChartSpaceValues, end: Date): Date {
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);

    switch (span) {
      case ChartSpaceValues.DAY:
        const dayOfWeek = start.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(start.getDate() - daysToMonday);
        break;
      case ChartSpaceValues.THREE_MONTHS:
        start.setMonth(end.getMonth() - 2);
        start.setDate(1);
        break;
      case ChartSpaceValues.SIX_MONTHS:
        start.setMonth(end.getMonth() - 5);
        start.setDate(1);
        break;
      case ChartSpaceValues.YEAR:
        start.setMonth(end.getMonth() - 11);
        start.setDate(1);
        break;
    }

    return start;
  }

  private async getWeeklyWeights(
    clientId: string,
    start: Date,
    end: Date
  ): Promise<WeightTrackingResponse> {
    const weighIns = await this.prisma.weighIn.findMany({
      where: {
        clientId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        weight: true,
      },
    });

    const weightMap = new Map<string, number>();
    weighIns.forEach((w) => {
      const dateKey = w.date.toISOString().slice(0, 10);
      weightMap.set(dateKey, Number(w.weight));
    });

    const labels: string[] = [];
    const data: (number | null)[] = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const cursor = new Date(start);

    for (let i = 0; i < 7; i++) {
      labels.push(daysOfWeek[i]);
      const dateKey = cursor.toISOString().slice(0, 10);
      const weight = weightMap.get(dateKey);
      data.push(weight !== undefined ? weight : null);
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      span: ChartSpaceValues.DAY,
      labels,
      data,
    };
  }

  private async getMonthlyAverages(
    clientId: string,
    start: Date,
    end: Date,
    span: ChartSpaceValues
  ): Promise<WeightTrackingResponse> {
    const weighIns = await this.prisma.weighIn.findMany({
      where: {
        clientId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        weight: true,
      },
    });

    const monthMap = new Map<string, number[]>();
    weighIns.forEach((w) => {
      const year = w.date.getFullYear();
      const month = String(w.date.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(Number(w.weight));
    });

    const labels: string[] = [];
    const data: (number | null)[] = [];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const cursor = new Date(start);

    while (cursor <= end) {
      const year = cursor.getFullYear();
      const month = String(cursor.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;

      labels.push(monthNames[cursor.getMonth()]);

      const weights = monthMap.get(monthKey);
      if (weights && weights.length > 0) {
        const sum = weights.reduce((acc, curr) => acc + curr, 0);
        const average = sum / weights.length;
        data.push(Math.round(average * 100) / 100);
      } else {
        data.push(null);
      }

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return {
      span,
      labels,
      data,
    };
  }
}
