import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { SleepService } from './sleep.service';
import { SleepController } from './sleep.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SleepController],
  providers: [SleepService],
  exports: [SleepService],
})
export class SleepModule {}
