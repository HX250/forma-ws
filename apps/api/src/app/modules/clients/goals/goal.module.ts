import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { GoalsService } from './goal.service';
import { GoalsController } from './goal.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
