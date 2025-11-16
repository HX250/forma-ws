import { DatabaseService } from '../../database';
import { Client } from '../../models/auth/client.model';
import { BaseRepository } from '../base.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClientTable } from '@forma-ws/domain';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(private prisma: DatabaseService) {
    super();
  }

  override async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    return client ? Client.fromPrisma(client) : null;
  }

  override async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { email } });
    return client ? Client.fromPrisma(client) : null;
  }

  async findByCoachId(coachId: string): Promise<ClientTable[] | []> {
    const clients = await this.prisma.client.findMany({
      where: { coachId },
      selectFromType: ClientTable,
    });
    return clients;
  }

  override async save(client: Client): Promise<Client> {
    const data = client.toPrisma();
    const savedClient = await this.prisma.client.create({ data });
    return Client.fromPrisma(savedClient);
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
    return Client.fromPrisma(updated);
  }

  protected override get prismaModel(): Prisma.ClientDelegate {
    return this.prisma.client;
  }

  protected override parseEntity(client: any): Client {
    return Client.fromPrisma(client);
  }
}
