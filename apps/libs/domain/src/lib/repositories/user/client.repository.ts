import { Client } from '../../models/auth/client.model';
import { BaseRepository } from '../base.repository';
import { DatabaseService } from '@forma-ws/shared';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(private prisma: DatabaseService) {
    super();
  }

  override async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) return null;

    return this.parseEntity(client);
  }

  override async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });

    if (!client) return null;

    return this.parseEntity(client);
  }

  override async save(client: Client): Promise<Client> {
    const data = client.toPrisma();

    const savedClient = await this.prisma.client.create({ data });

    return this.parseEntity(savedClient);
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

    return this.parseEntity(updated);
  }

  protected override get prismaModel(): Prisma.ClientDelegate {
    return this.prisma.client;
  }
  protected override parseEntity(client: any): Client {
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
