import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  AddWeighInDto,
  ChartSpaceValues,
  WeighInResponse,
} from '@forma-ws/domain';
import { WeightService } from './weight.service';

@Controller('tracking/weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get(':clientId/chart')
  getWeightTracking(
    @Param('clientId') clientId: string,
    @Query('span') span: string
  ) {
    const spanValue = span ? Number(span) : ChartSpaceValues.YEAR;
    return this.weightService.getWeightTracking(clientId, spanValue);
  }

  @Post()
  addDailyWeighIn(
    @Query('clientId') clientId: string,
    @Body() dto: AddWeighInDto
  ): Promise<boolean> {
    return this.weightService.logDailyWeighIn(clientId, dto);
  }

  @Get()
  getTodayTracking(
    @Query('clientId') clientId: string
  ): Promise<WeighInResponse> {
    return this.weightService.getTodayWeighIn(clientId);
  }
}
