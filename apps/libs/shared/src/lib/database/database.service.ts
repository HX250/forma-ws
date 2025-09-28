import { Injectable, OnModuleInit } from '@nestjs/common';
import { prisma } from './bootstrap-prisma';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private prisma = prisma;

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
