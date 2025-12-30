import {
  DatabaseService,
  DateUtils,
  prismaToPlain,
} from '@forma-ws/backend-shared';
import {
  AddSleepEntryDto,
  DeleteSleepEntryDto,
  GetSleepEntryDto,
  SleepEntryData,
} from '@forma-ws/domain';

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SleepService {
  constructor(private readonly prisma: DatabaseService) {}

  async getSleepEntry(dto: GetSleepEntryDto): Promise<SleepEntryData | null> {
    const { start, end } = DateUtils.getDayRange(dto.createdAt);

    const entry = await this.prisma.sleepEntry.findFirst({
      where: {
        clientId: dto.clientId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        bedTime: true,
        wakeTime: true,
        hoursSlept: true,
        sleepQuality: true,
        notes: true,
        createdAt: true,
      },
    });

    return entry ? prismaToPlain<SleepEntryData>(entry) : null;
  }

  async logSleepEntry(dto: AddSleepEntryDto): Promise<boolean> {
    const bedTime = new Date(dto.bedTime);
    const wakeTime = new Date(dto.wakeTime);

    if (wakeTime <= bedTime) {
      throw new BadRequestException('Wake time must be after bed time');
    }

    const hoursSlept = this.calculateHoursSlept(bedTime, wakeTime);

    const { start, end } = DateUtils.getDayRange(new Date());
    const existingEntry = await this.prisma.sleepEntry.findFirst({
      where: {
        clientId: dto.clientId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    if (existingEntry) {
      throw new ConflictException(
        'Sleep entry already exists for today. Please delete the existing entry first.'
      );
    }

    await this.prisma.sleepEntry.create({
      data: {
        clientId: dto.clientId,
        bedTime,
        wakeTime,
        hoursSlept,
        sleepQuality: dto.sleepQuality,
        notes: dto.notes,
      },
    });

    return true;
  }

  async removeSleepEntry(dto: DeleteSleepEntryDto): Promise<boolean> {
    const entry = await this.prisma.sleepEntry.findFirst({
      where: {
        id: dto.id,
        clientId: dto.clientId,
      },
    });

    if (!entry) {
      throw new NotFoundException(`Sleep entry with id ${dto.id} not found`);
    }

    await this.prisma.sleepEntry.delete({
      where: { id: dto.id },
    });

    return true;
  }

  private calculateHoursSlept(bedTime: Date, wakeTime: Date): number {
    let wake = new Date(wakeTime);
    const bed = new Date(bedTime);

    if (wake <= bed) {
      wake.setDate(wake.getDate() + 1);
    }

    const milliseconds = wake.getTime() - bed.getTime();
    const hours = milliseconds / (1000 * 60 * 60);

    return Math.round(hours * 100) / 100;
  }
}
