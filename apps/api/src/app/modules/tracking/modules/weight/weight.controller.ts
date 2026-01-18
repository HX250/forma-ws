import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChartSpaceVlues } from '@forma-ws/domain';
import { WeightService } from './weight.service';

@Controller('clients/:clientId/weight-tracking')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get()
  getWeightTracking(
    @Param('clientId') clientId: string,
    @Query('span') span: ChartSpaceVlues
  ) {
    return this.weightService.getWeightTracking(clientId, Number(span));
  }
}
