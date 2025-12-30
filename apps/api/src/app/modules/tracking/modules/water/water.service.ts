import {
  DatabaseService,
  DateUtils,
  prismaToPlain,
} from '@forma-ws/backend-shared';
import {
  AddWaterData,
  DeleteWaterData,
  GetWaterData,
  WaterData,
} from '@forma-ws/domain';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class WaterService {
  constructor(private readonly prisma: DatabaseService) {}

  async getWaterTrackingData(dto: GetWaterData): Promise<WaterData[]> {
    const { start, end } = DateUtils.getDayRange(dto.createdAt);

    const data = await this.prisma.waterEntry.findMany({
      where: {
        clientId: dto.clientId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaToPlain<WaterData[]>(data);
  }

  async logWaterTrackingData(dto: AddWaterData): Promise<boolean> {
    await this.prisma.waterEntry.create({
      data: {
        clientId: dto.clientId,
        amount: dto.amount,
      },
    });
    return true;
  }

  async removeWaterEntry(dto: DeleteWaterData): Promise<boolean> {
    const entry = await this.prisma.waterEntry.findFirst({
      where: {
        id: dto.id,
        clientId: dto.clientId,
      },
    });

    if (!entry) {
      throw new NotFoundException(`Water entry with id ${dto.id} not found`);
    }

    await this.prisma.waterEntry.delete({
      where: { id: dto.id },
    });

    return true;
  }
}
