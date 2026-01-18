import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChartSpaceValues } from '@forma-ws/domain';
import { WeightService } from './weight.service';

@Controller('clients/:clientId/weight-tracking')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get()
  getWeightTracking(
    @Param('clientId') clientId: string,
    @Query('span') span: ChartSpaceValues
  ) {
    return this.weightService.getWeightTracking(clientId, Number(span));
  }
}
