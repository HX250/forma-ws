import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client, ClientTable } from '@forma-ws/domain';
import { JwtAuthGuard, CoachOnlyGuard } from '@forma-ws/backend-shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthPayload {
  sub: string;
  email: string;
  userType: 'COACH' | 'CLIENT';
}

@Controller('clients')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':id')
  async getClient(@Param('id') id: string): Promise<Client> {
    const client = await this.clientsService.findById(id);
    return client;
  }

  @Get()
  @UseGuards(CoachOnlyGuard)
  async getAllClients(
    @CurrentUser() user: AuthPayload
  ): Promise<ClientTable[]> {
    const clients = await this.clientsService.getClientTableList(user.sub);
    return clients;
  }
}
