import { Injectable } from '@nestjs/common';
import { Client } from '@forma-ws/domain';
import { DatabaseService } from 'apps/api/src/database/database.service';

@Injectable()
export class ClientRepository {
  constructor(private prisma: DatabaseService) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) return null;

    return this.getParsedClient(client);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });

    if (!client) return null;

    return this.getParsedClient(client);
  }

  async updateAfterPasswordSet(client: Client): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id: client.id },
      data: {
        password: client.getPasswordHash(),
        oneTimePassword: null,
        isFirstLogin: false,
      },
    });

    return this.getParsedClient(updated);
  }

  async save(client: Client): Promise<Client> {
    const data = client.toPrisma();

    const savedClient = await this.prisma.client.create({ data });

    return this.getParsedClient(savedClient);
  }

  private getParsedClient(client: any): Client {
    return new Client(
      client.email,
      client.coachId,
      client.password,
      client.oneTimePassword,
      client.isFirstLogin,
      client.firstName,
      client.lastName,
      client.gender,
      client.birthDate,
      client.currentWeight.toNumber(),
      client.height.toNumber(),
      client.activityLevel,
      client.fitnessExperience,
      client.canTrackExercise,
      client.canTrackSleep,
      client.canTrackNutrition,
      client.canTrackWater,
      client.medicalConditions,
      client.createdAt,
      client.updatedAt,
      client.id
    );
  }
}
