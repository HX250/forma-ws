import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { DashboardController } from './dashboard.controller';
import { ClientsGrowthService } from './services/clients-growth.service';
import { WeightTrendService } from './services/weight-trend.service';
import { LoggingService } from './services/logging.service';
import { ClientEngagementService } from './services/client-engagement.service';
import { LoggingTimingService } from './services/logging-timing.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [
    ClientsGrowthService,
    WeightTrendService,
    LoggingService,
    ClientEngagementService,
    LoggingTimingService,
  ],
})
export class DashboardModule {}
