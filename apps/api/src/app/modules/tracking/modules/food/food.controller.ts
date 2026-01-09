import { JwtAuthGuard } from '@forma-ws/backend-shared';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Query,
  Param,
  BadRequestException,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { FoodService } from './food.service';
import {
  FoodDetail,
  FoodDetailList,
  GetTrackingData,
  NutritionEntryDto,
  NutritionSummary,
} from '@forma-ws/domain';

@Controller('tracking/food')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('search')
  async searchFoods(@Query('food') query: string): Promise<FoodDetailList[]> {
    if (!query || query.length < 2) {
      return [];
    }
    return this.foodService.searchFoods(query);
  }

  @Get(':id')
  async getFoodById(
    @Param('id') id: string,
    @Query('servingSize') servingSize: string
  ): Promise<FoodDetail> {
    const parsedServingSize = Number(servingSize);

    if (Number.isNaN(parsedServingSize)) {
      throw new BadRequestException('servingSize must be a number');
    }

    return this.foodService.getFoodById(id, parsedServingSize);
  }

  @Get()
  async getNutritionTrackingData(
    @Query() dto: GetTrackingData
  ): Promise<NutritionSummary> {
    return this.foodService.getNutritionTrackingData(dto);
  }

  @Post('/entries')
  async logNutritionEntry(
    @Query('id') clientId: string,
    @Body() dto: NutritionEntryDto
  ): Promise<boolean> {
    return this.foodService.logNutritionEntry(dto, clientId);
  }

  @Delete('/entries/:entryId')
  async deleteNutritionEntry(
    @Param('entryId') entryId: string,
    @Query('id') clientId: string
  ): Promise<boolean> {
    return this.foodService.deleteNutritionEntry(entryId, clientId);
  }
}
