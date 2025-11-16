import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { Client, ClientTable } from '@forma-ws/domain';
import { prismaToPlain } from '../../utils/prisma-to-plain';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: DatabaseService) {}

  async findById(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        coach: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        goals: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return prismaToPlain<Client>(client);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });
    return client ? prismaToPlain<Client>(client) : null;
  }

  async findAllByCoach(coachId: string): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: { coachId },
      include: {
        goals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return clients.map((client) => prismaToPlain<Client>(client));
  }

  async getClientTableList(coachId: string): Promise<ClientTable[]> {
    const clients = await this.prisma.client.findMany({
      where: { coachId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        canTrackExercise: true,
        canTrackSleep: true,
        canTrackNutrition: true,
        canTrackWater: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return clients;
  }

  async updateClient(id: string, data: any): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id },
      data,
    });
    return prismaToPlain<Client>(updated);
  }

  async deleteClient(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    });
  }
}
