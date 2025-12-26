import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
