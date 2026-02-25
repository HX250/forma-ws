import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CoachOnlyGuard, JwtAuthGuard } from '@forma-ws/backend-shared';
import {
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
    @Query('coachId') coachId: string,
    @Query('span') span: string
  ): Promise<ClientsGrowthResponse> {
    return this.clientsGrowthService.getClientsGrowth(coachId, Number(span));
  }

  @Get('weight-trend')
  async getWeightTrend(
    @Query('coachId') coachId: string
  ): Promise<WeightTrendDto> {
    return this.weightTrendService.getWeightTrend(coachId);
  }

  @Get('logging')
  async getLogging(@Query('coachId') coachId: string): Promise<LoggingDto[]> {
    return this.loggingService.getLoggingActivity(coachId);
  }

  @Get('client-engagement')
  async getClientEngagement(
    @Query('coachId') coachId: string
  ): Promise<ClientEngagementResponse> {
    return this.clientEngagementService.getClientEngagement(coachId);
  }

  @Get('logging-timing')
  async getLoggingTiming(
    @Query('coachId') coachId: string
  ): Promise<LoggingTimingResponse> {
    return this.loggingTimingService.getLoggingTiming(coachId);
  }
}
