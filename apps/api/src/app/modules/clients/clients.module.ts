import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { GoalsModule } from './goals/goal.module';

@Module({
  imports: [DatabaseModule, GoalsModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
