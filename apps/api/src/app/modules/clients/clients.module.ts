import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

import { DatabaseModule, ClientRepository } from '@forma-ws/backend-shared';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [ClientsController],
  providers: [ClientsService, ClientRepository],
  exports: [ClientsService],
})
export class ClientsModule {}
