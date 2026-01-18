import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { WeightService } from './weight.service';
import { WeightController } from './weight.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [WeightController],
  providers: [WeightService],
  exports: [WeightService],
})
export class WeightModule {}
