import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { WaterService } from './water.service';
import { WaterController } from './water.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [WaterController],
  providers: [WaterService],
  exports: [WaterService],
})
export class WaterModule {}
