import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { ClientsGrowthResponse } from '@forma-ws/domain';

@Injectable()
export class ClientsGrowthService {
  constructor(private readonly prisma: DatabaseService) {}

  async getClientsGrowth(
    coachId: string,
    span: number
  ): Promise<ClientsGrowthResponse> {
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - (span - 1), 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [newClients, totalActive] = await Promise.all([
      this.prisma.client.findMany({
        where: { coachId, createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      this.prisma.client.count({ where: { coachId } }),
    ]);

    const buckets = new Map<string, number>();
    const labels: string[] = [];

    for (let i = span - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleString('en-US', {
        month: 'short',
        year: '2-digit',
      });
      labels.push(label);
      buckets.set(label, 0);
    }

    for (const client of newClients) {
      const label = new Date(client.createdAt).toLocaleString('en-US', {
        month: 'short',
        year: '2-digit',
      });
      if (buckets.has(label)) {
        buckets.set(label, buckets.get(label)! + 1);
      }
    }

    const data = labels.map((l) => buckets.get(l)!);
    const newThisMonth = newClients.filter(
      (c) => new Date(c.createdAt) >= monthStart
    ).length;

    return { span, labels, data, newThisMonth, totalActive };
  }
}
