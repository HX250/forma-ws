import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import {
  AuthPayload,
  ClientGeneralDetails,
  ClientFitnessDetails,
  ClientPermissions,
  ClientTable,
} from '@forma-ws/domain';
import { JwtAuthGuard, CoachOnlyGuard } from '@forma-ws/backend-shared';
import { CurrentUser } from '../security/common/decorators/current-user.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('details/:id')
  async getClientDetails(
    @Param('id') id: string
  ): Promise<ClientGeneralDetails> {
    const client = await this.clientsService.getClientGeneralDetails(id);
    return client;
  }

  @Get('permissions/:id')
  async getClientPermissions(
    @Param('id') id: string
  ): Promise<ClientPermissions> {
    const client = await this.clientsService.getClientPermissions(id);
    return client;
  }

  @Get('health/:id')
  async getClientHealthDetails(
    @Param('id') id: string
  ): Promise<ClientFitnessDetails> {
    const client = await this.clientsService.getClientHealthDetails(id);

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
