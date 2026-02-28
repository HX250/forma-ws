import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import { ResolveCoachIdGuard } from './guards/resolve-coach-id.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [CoachController],
  providers: [CoachService, ResolveCoachIdGuard],
  exports: [CoachService],
})
export class CoachModule {}
