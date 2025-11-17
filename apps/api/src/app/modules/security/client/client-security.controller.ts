import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientSecurityService } from './client-security.service';
import { TokenService } from '../common/token/token.service';
import {
  RegisterClientDto,
  SetClientPasswordDto,
  Client,
  AuthPayload,
  UserType,
} from '@forma-ws/domain';
import { JwtAuthGuard } from '@forma-ws/backend-shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientSecurityController {
  constructor(
    private readonly clientSecurityService: ClientSecurityService,
    private readonly tokenService: TokenService
  ) {}

  @Post('register/client')
  async registerClient(@Body() dto: RegisterClientDto): Promise<Client> {
    return this.clientSecurityService.registerClient(dto);
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  async setPassword(
    @CurrentUser() user: AuthPayload,
    @Body() dto: SetClientPasswordDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Client> {
    const client = await this.clientSecurityService.setClientPassword(
      user.sub,
      dto
    );

    const payload = this.tokenService.createAuthPayload(
      client.id,
      client.email,
      UserType.CLIENT
    );

    this.tokenService.generateAndSetTokens(payload, res);

    return client;
  }
}
