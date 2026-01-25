import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { WaterModule } from './modules/water/water.module';
import { SleepModule } from './modules/sleep/sleep.module';
import { FoodModule } from './modules/food/food.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { WeightModule } from './modules/weight/weight.module';

@Module({
  imports: [
    DatabaseModule,
    WaterModule,
    SleepModule,
    FoodModule,
    ExerciseModule,
    WeightModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
