import { Module } from '@nestjs/common';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
