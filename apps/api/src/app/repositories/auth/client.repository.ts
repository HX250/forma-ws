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
    const data = {
      id: client.id,
      email: client.email,
      coachId: client.coachId,
      password: client.getPasswordHash(),
      oneTimePassword: client.getOneTimePassword(),
      isFirstLogin: client.isFirstLogin,
      firstName: client.firstName,
      lastName: client.lastName,
      gender: client.gender,
      birthDate: client.birthDate,
      currentWeight: client.currentWeight,
      height: client.height,
      activityLevel: client.activityLevel,
      medicalConditions: client.medicalConditions,
      fitnessExperience: client.fitnessExperience,
      canTrackExercise: client.canTrackExercise,
      canTrackSleep: client.canTrackSleep,
      canTrackNutrition: client.canTrackNutrition,
      canTrackWater: client.canTrackWater,
    };

    const savedClient = await this.prisma.client.upsert({
      where: { id: client.id },
      update: data,
      create: data,
    });

    return this.getParsedClient(savedClient);
  }

  private getParsedClient(client: any): Client {
    return new Client(
      client.id,
      client.email,
      client.coachId,
      client.password,
      client.oneTimePassword,
      client.isFirstLogin,
      client.firstName,
      client.lastName,
      client.gender,
      client.birthDate,
      Number(client.currentWeight),
      Number(client.height),
      client.activityLevel,
      client.fitnessExperience,
      client.canTrackExercise,
      client.canTrackSleep,
      client.canTrackNutrition,
      client.canTrackWater,
      client.medicalConditions,
      client.createdAt,
      client.updatedAt
    );
  }
}
