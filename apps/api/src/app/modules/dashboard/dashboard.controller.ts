import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CoachOnlyGuard, JwtAuthGuard } from '@forma-ws/backend-shared';
import {
  AuthPayload,
  ClientsGrowthResponse,
  WeightTrendDto,
  LoggingDto,
  ClientEngagementResponse,
  LoggingTimingResponse,
} from '@forma-ws/domain';
import { ClientsGrowthService } from './services/clients-growth.service';
import { WeightTrendService } from './services/weight-trend.service';
import { LoggingService } from './services/logging.service';
import { ClientEngagementService } from './services/client-engagement.service';
import { LoggingTimingService } from './services/logging-timing.service';
import { CurrentUser } from '../security/common/decorators/current-user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, CoachOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DashboardController {
  constructor(
    private readonly clientsGrowthService: ClientsGrowthService,
    private readonly weightTrendService: WeightTrendService,
    private readonly loggingService: LoggingService,
    private readonly clientEngagementService: ClientEngagementService,
    private readonly loggingTimingService: LoggingTimingService
  ) {}

  @Get('clients-growth')
  async getClientsGrowth(
    @CurrentUser() user: AuthPayload,
    @Query('span', ParseIntPipe) span: number
  ): Promise<ClientsGrowthResponse> {
    return this.clientsGrowthService.getClientsGrowth(user.sub, span);
  }

  @Get('weight-trend')
  async getWeightTrend(
    @CurrentUser() user: AuthPayload
  ): Promise<WeightTrendDto> {
    return this.weightTrendService.getWeightTrend(user.sub);
  }

  @Get('logging')
  async getLogging(@CurrentUser() user: AuthPayload): Promise<LoggingDto[]> {
    return this.loggingService.getLoggingActivity(user.sub);
  }

  @Get('client-engagement')
  async getClientEngagement(
    @CurrentUser() user: AuthPayload
  ): Promise<ClientEngagementResponse> {
    return this.clientEngagementService.getClientEngagement(user.sub);
  }

  @Get('logging-timing')
  async getLoggingTiming(
    @CurrentUser() user: AuthPayload
  ): Promise<LoggingTimingResponse> {
    return this.loggingTimingService.getLoggingTiming(user.sub);
  }
}
