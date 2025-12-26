import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CoachController],
  providers: [CoachService],
  exports: [CoachService],
})
export class CoachModule {}
