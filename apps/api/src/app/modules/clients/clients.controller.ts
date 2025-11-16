import { Controller, Get, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientTable } from '@forma-ws/domain';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  async getList(@Query('coachId') coachId: string): Promise<ClientTable[]> {
    return this.clientsService.getList(coachId);
  }
}
